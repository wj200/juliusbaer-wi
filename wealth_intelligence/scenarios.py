"""Forward-looking scenario re-pricing — the 'what could happen next?' layer.

Applies an illustrative, fully transparent shock vector to every holding and
re-derives what the RM cares about: the change in book value, the loan-to-value
on each facility (does it cross the margin call?), and single-name exposure.
Two scenarios, both grounded in the *direction and rough magnitude* of moves the
five 2026 snapshots actually contain (energy, gold, HK property, rates):

    escalate    Middle East worsens — Brent up, gold up, HK property down, rates up.
    deescalate  Strait reopens — the mirror.

This is a **stylised sensitivity model, not a risk engine** — and deliberately
so. The shock vector and the per-instrument sensitivities are computed here (not
by any language model), so the scenario is deterministic and auditable, exactly
like every other signal in the engine.
"""

from __future__ import annotations

from collections import defaultdict

from .data_model import TODAY, Book, _num
from .lookthrough import resolve

SCENARIOS = {
    "escalate": {
        "label": "Escalation",
        "note": "Middle East worsens · Brent +30% · gold +10% · HK property −12% · UST +40bp",
    },
    "deescalate": {
        "label": "De-escalation",
        "note": "Strait reopens · Brent −25% · gold −8% · HK property +8% · UST −30bp",
    },
}


def price_shock(inst, key: str) -> float:
    """Illustrative price change (fraction) for one instrument under a scenario."""
    if inst is None:
        return 0.0
    esc = key == "escalate"

    def s(e, d):
        return e if esc else d

    name = (inst.instrument_name or "").lower()
    ref = (inst.underlying_reference or "").lower()
    sec = inst.sector or ""
    ac = inst.asset_class or ""
    reg = inst.region or ""
    sub = inst.sub_asset_class or ""

    if ac == "Cash and Equivalents":
        return 0.0
    if sec == "Gold" or "gold" in name or "xau" in ref:
        return s(+0.09, -0.07)
    if sec == "Energy" or "energy" in ref or "bara nusantara" in name:
        return s(+0.13, -0.11)
    if any(t in name or t in ref for t in ("shipping", "pacific orient", "marine", "gulf")):
        return s(+0.09, -0.08)
    if sec == "Real Estate" and (reg == "Hong Kong" or "golden harbour" in name or "mid-levels" in name):
        return s(-0.10, +0.07)
    if ac == "Structured Products" and any(t in ref for t in ("energy", "shipping", "bara", "gulf", "orient")):
        return s(+0.03, -0.03)
    if sec == "Information Technology":
        return s(-0.07, +0.06)
    if ac == "Fixed Income":
        if "2045" in name or sub == "Subordinated Perpetual":
            return s(-0.06, +0.05)
        return s(-0.03, +0.03)
    if sub == "Real Estate Securities" or "reit" in name:
        return s(-0.04, +0.03)
    if reg in ("Greater China", "Asia ex-Japan", "Emerging Markets", "Southeast Asia", "South Asia") \
            or sub == "Emerging Market Equity":
        return s(-0.05, +0.05)
    if ac == "Commodities":
        return s(+0.05, -0.04)
    if ac == "Equity":
        return s(-0.04, +0.04)
    if ac == "Alternatives":
        return s(-0.01, +0.01)
    return s(-0.02, +0.02)


def apply(book: Book, client_id: str, key: str) -> dict:
    """Re-price a client's book under a scenario and return the RM-facing deltas."""
    from .detectors import _tightest_single_limit  # local import avoids a cycle

    holds = book.holdings_of(client_id, TODAY)
    total0 = sum(h.mv for h in holds)
    shock = {h.instrument_id: price_shock(book.instrument(h.instrument_id), key) for h in holds}

    def nmv(h):
        return h.mv * (1 + shock.get(h.instrument_id, 0.0))

    total1 = sum(nmv(h) for h in holds) or 1.0
    value_delta = (total1 / total0 - 1) * 100 if total0 else 0.0

    # Facilities: scale lending value by the collateral portfolio's revaluation.
    ltvs = []
    breach = False
    for f in book.facilities_of(client_id):
        pf_holds = [h for h in holds if h.portfolio_id == f.collateral_portfolio_id]
        old = sum(h.mv for h in pf_holds)
        new = sum(nmv(h) for h in pf_holds)
        r = (new / old) if old else 1.0
        lend = _num(f.raw.get(f"lending_value_{TODAY}"))
        drawn = f.drawn_now
        if lend and drawn:
            new_ltv = drawn / (lend * r) * 100
            b = new_ltv >= f.margin_call_ltv_pct
            breach = breach or b
            ltvs.append({
                "facility": f.facility_type, "now": round(new_ltv, 1),
                "margin_call": f.margin_call_ltv_pct,
                "distance": round(f.margin_call_ltv_pct - new_ltv, 2), "breach": b,
            })

    # Single-name look-through under the shocked values.
    managed_pids = {p.portfolio_id for p in book.portfolios_of(client_id) if p.is_managed}
    direct, managed = defaultdict(float), defaultdict(float)
    for h in holds:
        for e in resolve(book.instrument(h.instrument_id)):
            if e.kind == "direct":
                direct[e.issuer] += nmv(h)
                if h.portfolio_id in managed_pids:
                    managed[e.issuer] += nmv(h)
    limit = _tightest_single_limit(book, client_id)
    rows = []
    for issuer, mv in sorted(direct.items(), key=lambda kv: -kv[1])[:7]:
        rows.append({
            "issuer": issuer, "usd": round(mv, 0), "pct": round(100 * mv / total1, 1),
            "over_limit": bool(limit and 100 * managed.get(issuer, 0.0) / total1 > limit),
            "custody_only": managed.get(issuer, 0.0) <= 0.01 * mv,
        })

    # A stress metric for re-ranking: a margin breach dominates; then drawdown.
    stress = (1000 if breach else 0) + max(0.0, -value_delta) * (3 if key == "escalate" else 1)
    return {
        "value_delta_pct": round(value_delta, 1),
        "ltv": ltvs, "breach": breach,
        "exposure": {"limit": limit, "rows": rows},
        "stress": round(stress, 1), "note": SCENARIOS[key]["note"],
    }
