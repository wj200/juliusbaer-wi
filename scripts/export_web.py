"""Export the engine's analysis as a single JSON payload for the web dashboard.

Builds one self-contained object — book KPIs, and per client the profile,
findings, a grounded (or offline) explanation, and everything the charts need
(value across snapshots, allocation, look-through exposure, LTV series). The
dashboard embeds this payload, so the page is fully static and needs no backend.

    python scripts/export_web.py            # writes docs/dashboard.html (built)
    python scripts/export_web.py --json out.json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from wealth_intelligence.data_model import SNAPSHOTS, TODAY, load_book
from wealth_intelligence.detectors import _tightest_single_limit
from wealth_intelligence.engine import analyse_book
from wealth_intelligence.explainer import explain
from wealth_intelligence.lookthrough import resolve
from wealth_intelligence.scenarios import apply as scenario_apply

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TEMPLATE = os.path.join(HERE, "dashboard_template.html")
OUT_HTML = os.path.join(ROOT, "docs", "dashboard.html")


def _value_series(book, cid):
    out = []
    for d in SNAPSHOTS:
        out.append({"date": d, "usd": round(book.total_usd(cid, d), 0)})
    return out


def _allocation(book, cid):
    holds = book.holdings_of(cid, TODAY)
    total = sum(h.mv for h in holds) or 1.0
    agg = defaultdict(float)
    for h in holds:
        agg[h.asset_class] += h.mv
    rows = [{"label": k, "usd": round(v, 0), "pct": round(100 * v / total, 1)}
            for k, v in sorted(agg.items(), key=lambda kv: -kv[1])]
    return rows


def _exposure(book, cid):
    holds = book.holdings_of(cid, TODAY)
    total = sum(h.mv for h in holds) or 1.0
    managed_pids = {p.portfolio_id for p in book.portfolios_of(cid) if p.is_managed}
    direct = defaultdict(float)
    managed = defaultdict(float)
    for h in holds:
        for e in resolve(book.instrument(h.instrument_id)):
            if e.kind == "direct":
                direct[e.issuer] += h.mv
                if h.portfolio_id in managed_pids:
                    managed[e.issuer] += h.mv
    limit = _tightest_single_limit(book, cid)
    rows = []
    for issuer, mv in sorted(direct.items(), key=lambda kv: -kv[1])[:7]:
        pct = 100 * mv / total
        mpct = 100 * managed.get(issuer, 0.0) / total
        rows.append({
            "issuer": issuer, "usd": round(mv, 0), "pct": round(pct, 1),
            "over_limit": bool(limit and mpct > limit),
            "custody_only": managed.get(issuer, 0.0) <= 0.01 * mv,
        })
    return {"limit": limit, "rows": rows}


def _ltv(book, cid):
    out = []
    for f in book.facilities_of(cid):
        series = [{"date": d, "ltv": v} for d, v in f.ltv_series() if v is not None]
        if not series:
            continue
        out.append({
            "facility": f.facility_type,
            "margin_call": f.margin_call_ltv_pct,
            "now": f.ltv_now,
            "distance": round(f.distance_to_call, 2) if f.distance_to_call is not None else None,
            "series": series,
        })
    return out


def build_payload(book) -> dict:
    dossiers = analyse_book(book)
    counts = defaultdict(int)
    for d in dossiers:
        counts[d.top_severity.label] += 1
    clients = []
    for rank, d in enumerate(dossiers, 1):
        c = book.clients[d.client_id]
        exp = explain(book, d)
        clients.append({
            "rank": rank,
            "id": d.client_id,
            "name": c.client_name,
            "age": c.age,
            "life_stage": c.life_stage,
            "risk_profile": c.risk_profile,
            "risk_score": c.risk_tolerance_score,
            "liquidity_needs": c.liquidity_needs,
            "booking_centre": c.booking_centre,
            "objectives": c.objectives,
            "total_usd": round(d.total_usd, 0),
            "score": d.score,
            "top_severity": d.top_severity.label,
            "lead": d.lead_finding.headline if d.lead_finding else "No material signals this cycle",
            "findings": [f.as_dict() for f in d.sorted_findings()],
            "explanation": exp.as_dict(),
            "charts": {
                "value_series": _value_series(book, d.client_id),
                "allocation": _allocation(book, d.client_id),
                "exposure": _exposure(book, d.client_id),
                "ltv": _ltv(book, d.client_id),
                "scenario": {
                    "escalate": scenario_apply(book, d.client_id, "escalate"),
                    "deescalate": scenario_apply(book, d.client_id, "deescalate"),
                },
            },
        })
    return {
        "as_of": TODAY,
        "snapshots": SNAPSHOTS,
        "book": {
            "total_aum_usd": round(sum(d.total_usd for d in dossiers), 0),
            "n_clients": len(dossiers),
            "n_portfolios": len(book.portfolios),
            "n_positions": len(book.holdings),
            "severity_counts": dict(counts),
        },
        "clients": clients,
    }


def render_html(payload: dict) -> str:
    with open(TEMPLATE, encoding="utf-8") as fh:
        template = fh.read()
    data = json.dumps(payload, separators=(",", ":"), default=str)
    return template.replace("/*__WI_DATA__*/null", data)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", help="write raw JSON here instead of building HTML")
    args = ap.parse_args()
    book = load_book()
    payload = build_payload(book)
    if args.json:
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump(payload, fh, indent=2, default=str)
        print(f"wrote {args.json}")
        return
    html = render_html(payload)
    os.makedirs(os.path.dirname(OUT_HTML), exist_ok=True)
    with open(OUT_HTML, "w", encoding="utf-8") as fh:
        fh.write(html)
    print(f"built {OUT_HTML}  ({len(html)//1024} KB, {len(payload['clients'])} clients)")


if __name__ == "__main__":
    main()
