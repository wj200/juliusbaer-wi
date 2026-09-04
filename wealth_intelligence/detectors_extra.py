"""Additional detectors, kept in their own module.

Two further deterministic signals that broaden the engine beyond the core six:

    detect_currency_mismatch  Future obligations denominated in a currency the
                              client's book barely holds — a funding/FX risk the
                              RM should plan for (e.g. USD school fees / tax on a
                              largely SGD book).
    detect_review_due         KYC / periodic review falling due (or overdue)
                              relative to today — an operational-compliance nudge.

Both are registered into wealth_intelligence.detectors.ALL_DETECTORS.
"""

from __future__ import annotations

from collections import defaultdict
from datetime import date
from typing import Optional

from .data_model import BASELINE, TODAY, Book
from .findings import Finding, Severity, usd

_TODAY = date.fromisoformat(TODAY)


def _parse(s: str) -> Optional[date]:
    try:
        return date.fromisoformat(s)
    except (ValueError, TypeError):
        return None


# --------------------------------------------------------------------------- #
# Currency mismatch
# --------------------------------------------------------------------------- #
def detect_currency_mismatch(book: Book, client_id: str) -> list[Finding]:
    holds = book.holdings_of(client_id, TODAY)
    total = sum(h.mv for h in holds)
    if total <= 0:
        return []

    # Where the liquid/holding value actually sits, by instrument currency.
    ccy_mv: dict[str, float] = defaultdict(float)
    for h in holds:
        ccy_mv[h.instrument_ccy] += h.mv
    exposure = {c: v / total for c, v in ccy_mv.items()}
    dominant = max(ccy_mv, key=ccy_mv.get) if ccy_mv else "USD"

    # Obligations grouped by currency (skip purely aspirational ones).
    oblig: dict[str, float] = defaultdict(float)
    labels: dict[str, list[str]] = defaultdict(list)
    for n in book.cash_needs_of(client_id):
        if (n.get("certainty") or "").lower().startswith("aspirational"):
            continue
        c = (n.get("currency") or "USD").upper()
        amt_usd = book.fx.to_usd(float(n.get("amount") or 0), c, TODAY)
        oblig[c] += amt_usd
        labels[c].append(n.get("description", ""))

    # A currency is "mismatched" if the client owes materially in it but holds
    # little of it. Aggregate the mismatched obligations.
    mismatched_usd = 0.0
    ccys: list[str] = []
    for c, amt in oblig.items():
        if amt >= max(1_000_000, 0.05 * total) and exposure.get(c, 0.0) < 0.20:
            mismatched_usd += amt
            ccys.append(c)
    if not ccys:
        return []

    pct = 100 * mismatched_usd / total
    sev = Severity.HIGH if pct >= 15 else Severity.MEDIUM

    # FX colour: for a single dominant mismatched currency, how its USD cost
    # moved since year-start (honest, directional).
    fx_note = ""
    lead_ccy = max(ccys, key=lambda c: oblig[c])
    if book.fx.known(lead_ccy) and lead_ccy != "USD":
        base = book.fx.to_usd(1.0, lead_ccy, BASELINE)
        now = book.fx.to_usd(1.0, lead_ccy, TODAY)
        if base:
            chg = (now / base - 1) * 100
            if abs(chg) >= 1:
                fx_note = (
                    f" In USD terms the {lead_ccy} has moved {chg:+.1f}% since year-start, "
                    f"making that obligation {'more' if chg > 0 else 'less'} expensive to fund."
                )

    exp_lead = 100 * exposure.get(lead_ccy, 0.0)
    detail = (
        f"{usd(mismatched_usd)} of upcoming obligations are denominated in "
        f"{', '.join(sorted(ccys))} ({'; '.join(labels[lead_ccy][:2])}), but the book is "
        f"largely in {dominant} — only {exp_lead:.0f}% sits in {lead_ccy}. Meeting them means "
        f"converting other assets, exposing the client to the exchange rate at the time."
        + fx_note
    )
    return [
        Finding(
            client_id=client_id,
            category="currency",
            severity=sev,
            headline=f"Currency mismatch: {usd(mismatched_usd)} of {', '.join(sorted(ccys))} obligations on a {dominant} book",
            detail=detail,
            facts={
                "mismatched_obligations_usd": round(mismatched_usd, 0),
                "obligation_currencies": sorted(ccys),
                "dominant_asset_ccy": dominant,
                "exposure_to_lead_ccy_pct": round(exp_lead, 1),
                "pct_of_book": round(pct, 1),
            },
            evidence=["planned_cash_needs.csv", "holdings.csv:instrument_ccy", "market_context.csv"],
        )
    ]


# --------------------------------------------------------------------------- #
# KYC / periodic review due
# --------------------------------------------------------------------------- #
def detect_review_due(book: Book, client_id: str) -> list[Finding]:
    c = book.clients[client_id]
    due = _parse(c.raw.get("kyc_review_due", ""))
    if due is None:
        return []
    days = (due - _TODAY).days
    if days < 0:
        sev, when = Severity.HIGH, f"overdue by {abs(days)} days"
    elif days <= 45:
        sev, when = Severity.MEDIUM, f"due in {days} days"
    elif days <= 90:
        sev, when = Severity.LOW, f"due in {days} days"
    else:
        return []
    return [
        Finding(
            client_id=client_id,
            category="review",
            severity=sev,
            headline=f"KYC / periodic review {when} ({due.isoformat()})",
            detail=(
                f"The client's periodic review is {when}. Worth clearing before or alongside the "
                f"next meeting so any advice sits on an up-to-date file — an operational item, not "
                f"a portfolio risk, but one the RM owns."
            ),
            facts={"kyc_review_due": due.isoformat(), "days_from_today": days},
            evidence=[f"clients.csv:{client_id}"],
        )
    ]
