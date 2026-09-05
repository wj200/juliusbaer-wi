# Wealth Intelligence — Project Description

An AI-powered wealth-intelligence layer for private-bank Relationship Managers (RMs),
built for **SingHacks 2026 (Julius Baer challenge)**. It turns descriptive portfolio
monitoring into proactive, explainable advisory: *what is happening in a client's
portfolio → what could happen next → what should I do about it.*

---

## 1. Background

Private banks give RMs and clients rich but **descriptive** tools — valuations,
performance, allocations, market data. The interpretation is still manual: an RM must
read across asset classes, currencies, jurisdictions, mandates, credit facilities and
client objectives to work out which of their clients needs attention today, and why.
That does not scale as books grow more complex, and it makes advice reactive.

The challenge was to build the missing **intelligence layer**: something that
continuously reads a whole book, surfaces the risks and opportunities that matter,
ranks clients by who to call first, and produces language an RM can actually use in a
client conversation — while respecting a hard governance constraint that a regulated
bank cannot ship without.

The dataset is fully synthetic but realistic: ~20 clients, ~1,000 positions across
five point-in-time snapshots (2025-12-31 → 2026-08-26), with fund holdings, structured
products, Lombard credit facilities, discretionary/advisory mandates, RM notes and a
market event log calibrated to real 2026 market history, so portfolio behaviour is
explainable against events that actually happened.

---

## 2. Architectural design decisions

The central decision shapes everything else: **a strict governance boundary between
computation and language.**

- **A deterministic engine computes every number.** All risk signals, exposures,
  loan-to-value figures, rankings and scenario re-pricings are produced by pure
  Python (standard library only — no pandas, no ML). Given the same book, it produces
  the same output, and every figure is traceable to the source rows that produced it.
- **The language model only explains — it never computes.** The LLM is handed the
  already-computed facts, the client's profile and objectives, the RM's notes and the
  authoritative event rows, and is instructed to reason *only* from them. It writes the
  situation summary and suggested talking points; it never invents a number or a
  holding. **That separation is the compliance story** — the part a bank's risk and
  audit functions can actually sign off on.

Supporting decisions:

- **Time is a first-class dimension.** The engine reasons across the five snapshots
  (e.g. LTV drifting 53.9% → 69.4% toward a 70% margin call), not just today's balance,
  so it can distinguish a stable position from one trending into trouble.
- **Look-through resolution.** A fund is decomposed to its underlying issuers before
  concentration and single-name limits are checked, so exposure hidden inside pooled
  vehicles is caught rather than masked.
- **Explainable ranking.** A client's priority score is the sum of the squares of their
  findings' severities (Σ severity²), so one genuine emergency outranks a pile of minor
  drift, and the RM can always see exactly why one client outranks another.
- **Demo-grade robustness.** Every explanation is cached to disk keyed on a hash of its
  exact inputs, so hero clients can be pre-generated and the demo runs with no network;
  if there is no API key or any error, the layer falls back to a deterministic
  explanation assembled from the findings themselves. **The app always works** — the AI
  makes it better, it is never a single point of failure.
- **Deploy like a bank would.** The app ships as one immutable container image with the
  API key injected at runtime as a secret, never baked in; `.env` and the cache are
  git-ignored; the image honours the platform's injected `$PORT`.

### System shape

```
CSV / JSON book  →  Data model (Book, look-through)  →  8 deterministic detectors
                                                              │
                                          Findings (typed, severity-tagged, evidenced)
                                                              │
                        ┌─────────────────────────────────────┴───────────────────────┐
                Book engine: rank clients (Σ severity²)                    Scenario re-pricing
                        │                                              (deterministic sensitivity)
                        ▼                                                          │
             Grounded explainer (Claude, facts-only) ── cache / offline fallback  │
                        │                                                          │
                        └──────────────────────►  Streamlit + HTML command-deck  ◄─┘
                                                   (call queue, briefing, charts,
                                                    scenario toggle, signal triage)
```

---

## 3. Main functionality

- **Book-wide triage.** Runs 8 deterministic detectors across every client every cycle
  and produces a ranked **call queue** — who to call first, defensible by score.
- **The 8 detectors** measure: collateral / loan-to-value stress against margin-call
  triggers; single-name and issuer concentration (with fund look-through); mandate
  drift vs. the client's discretionary/advisory constraints; forward liquidity vs.
  planned cash needs and commitments; performance attribution (what drove the move);
  income-strategy suitability; currency mismatch between assets and liabilities/needs;
  and periodic-review due dates.
- **Grounded RM briefing.** For a selected client, a Claude-written briefing — a short
  situation summary, two or three talking points / actions to consider, and an honest
  list of watch-outs to verify — generated live from the computed facts, or served from
  cache / the offline fallback.
- **Forward-looking scenarios.** A one-click **escalate / de-escalate** toggle re-prices
  the whole book under an illustrative, fully transparent shock vector (e.g. Brent +30%,
  gold +10%, HK property −12%, rates +40bp), re-deriving book-value change, each
  facility's LTV (does it now breach the margin call?) and single-name exposure — a
  stylised sensitivity model, deterministic and auditable, not a black box.
- **RM workbench.** A dark "command-deck" dashboard: the ranked queue, a client dossier
  leading with the briefing, portfolio-value and LTV / allocation charts, look-through
  exposure bars, and a **signal-triage** panel where the RM can accept, edit or dismiss
  each finding for the client file.

---

## 4. Engineering

- **~2,000 lines** of pure-standard-library Python for the engine (no third-party
  dependency in the core), a thin Streamlit + self-contained HTML/SVG presentation
  layer, and the Anthropic SDK only in the explanation layer.
- **21 unit tests** covering the detectors, look-through, ranking and scenario maths.
- **CLI + web + container**: a command-line report, a Streamlit workbench, and a
  Dockerfile deployable to Google Cloud Run.

**Stack:** Python (standard library), Streamlit, HTML/CSS/SVG, Anthropic Claude API,
Docker, Google Cloud Run.
