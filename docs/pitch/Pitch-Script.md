# Wealth Intelligence — Pitch Script
**SingHacks 2026 · Julius Baer, Track #1 · ~5 minutes + demo**

> Delivery notes: speak to the *client*, not the code. Land the one thesis —
> *the engine computes, the model only explains* — at least twice. When you demo,
> open on **Lau Chi Ming** and let the margin-call gauge do the talking.

---

### Slide 1 — Title  ·  (0:00–0:25)
"Good [morning]. Private banking runs on one relationship — the RM and their client. But the tools that RM uses only *describe*: here's your value, here's your allocation. We built **Wealth Intelligence**: the layer that turns that description into *advice*. And it's built on one principle — a deterministic engine computes every signal from the bank's own data, and a language model is used only to *explain* it, never to invent it."

### Slide 2 — The case  ·  (0:25–1:00)
"Meet Priscilla. One RM, twenty clients across Singapore and Hong Kong, meetings in a fortnight. Her clients span an eight-million individual to an eighty-eight-million family office. Her current tools answer *'what does the portfolio look like?'* — but the brief asks us to get her to *'what should I know, and what should I do next?'* And the data has a time dimension: five snapshots across a 2026 energy shock, a Strait of Hormuz closure, and a tech drawdown. The signal lives in the *change*, not the snapshot."

### Slide 3 — Our answer  ·  (1:00–1:30)
"Our answer is three stages. **Signal** — the engine computes every risk from the files. **Understanding** — a grounded explanation turns those facts into a read she can defend in a meeting. **Decision** — she triages the book, drills in, and accepts, edits or dismisses each insight. The differentiator is the line at the bottom: the engine decides what's *true*; the model only narrates it."

### Slide 4 — The product  ·  DEMO  ·  (1:30–2:45)
"And it's real — here's the live workbench." *(Switch to the app, on Lau Chi Ming.)*
- "On the left, the **call queue** — all twenty clients ranked by a transparent priority score. I can filter, sort, search." *(filter to Severe.)*
- "Lau is number one. Look why: this **gauge** is his loan-to-value — **69.4%**, and the margin call is **70%**. He is six-tenths of a point from a forced sale, because the 2026 shocks cut his collateral."
- "These **exposure bars** are look-through: his stock, his perpetual, and an accumulator are all *the same name* — 29% of the book in one bet." *(open a signal.)*
- "Every signal opens to its exact facts and the **source rows** behind it — nothing is a black box. And I Accept, Edit or Dismiss — that builds my meeting-prep list. The RM stays in control."

### Slide 5 — How it works: architecture  ·  (2:45–3:10)
"Under the hood: twelve files join into one currency-aware model. Eight detectors compute every signal and rank the book. Then the **governance boundary** — deterministic and auditable above it; below it, a single language model that only explains. Remove the model entirely and the engine still produces the whole triage. You just lose the narration."

### Slide 6 — The eight detectors  ·  (3:10–3:30)
"The engine is eight deterministic detectors — collateral, concentration with look-through, mandate and ESG-exclusion breaches, liquidity net of pledged collateral, income sustainability, event attribution, currency mismatch, and KYC review. The ranking is the sum of severity squared, so one genuine emergency beats a pile of minor drift — and we can always defend the order."

### Slide 7 — The data traps  ·  (3:30–4:00)
"This is where *understanding* shows, because the data sets traps. A Hong Kong book looks like it fell from 206 to 26 million — that's just currency conversion, not a loss. A 41% family stake looks like a breach — but it's custody, a conversation not a correction. Nineteen million looks sellable — until you see it's pledged to a loan. Three small positions are one 29% bet. Handling these is what separates *arithmetic* from *understanding the client*."

### Slide 8 — The governance boundary  ·  (4:00–4:25)
"This is the most important decision, and why it could live inside a bank. The engine computes and carries its evidence. Only facts cross the boundary. The model explains those facts, cites only what it's given, and is honest about uncertainty — it *can't* hallucinate a number, because it never has the job of producing one. The trade-off, openly: it can't surface a signal we didn't encode. We accept that, because a bank can't put an unexplainable insight in front of a client."

### Slide 9 — Design decisions & trade-offs  ·  (4:25–4:45)
"Every choice was made for a regulated environment, and each has an honest cost. Deterministic core — defensible, but the model can't invent signals. Pure standard library — runs anywhere, trivial to audit. An explicit look-through table — auditable, not guessed. Cached explanations — the demo never needs the network. Evidence on every finding — full traceability. We're showing the costs because we chose them deliberately."

### Slide 10 — Why it uniquely fits  ·  (4:45–5:05)
"Why us? It prioritises the *whole book* — the brief's own question, who to call first and can you defend it. Every insight is defensible. And it understands the *client*, not just the maths — mandate, tax domicile, objectives, and the RM's own notes. Lau makes it concrete: point-six from a margin call, 29% one name, twelve million actually free — and Priscilla can defend every number."

### Slide 11 — Built to live inside JB  ·  (5:05–5:25)
"And it's shaped to ship. It maps one-to-one onto the bank's trust requirements: explainability, suitability, human oversight, traceability, security — no client data leaves the engine, the key lives in the environment — and operability: a stdlib engine plus one container image, on any bank-approved Python host."

### Slide 12 — Faithful to the case  ·  (5:25–5:40)
"We followed the brief exactly — signal, understanding, decision — went deep on three clients rather than shallow on twenty, grounded everything in the authoritative event log, and we *noticed* the data's imperfections and said so. It maps cleanly to all four rubric criteria."

### Slide 13 — Close  ·  (5:40–6:00)
"The north star was to build the intelligence layer between portfolio data and the Relationship Manager. That's what this is — helping RMs understand what matters, anticipate what's next, and turn complexity into trustworthy advice, with the RM kept central and owning every decision. Next is a live scenario toggle and a meeting-pack export. Thank you — we'd love your questions."

---

## Anticipated Q&A
- **"Isn't the LLM the risk?"** — It never computes. It's handed pre-computed facts and told to explain and cite only those. Remove it and the engine still works; the numbers never depend on it.
- **"How does this scale past 20 clients?"** — The detector interface is unchanged; the in-memory model swaps for a columnar store behind it. Nothing about the signals or the UI changes.
- **"What about hallucination in front of a client?"** — Structurally prevented: no un-cited number can appear, and the layer refuses / flags uncertainty rather than inventing a story.
- **"Is the data real?"** — Entirely synthetic; we treat it as if it were real, which is part of the exercise.
- **"Why not just a dashboard?"** — A dashboard shows twenty clients. This *understands* three, ranks all twenty by defensible urgency, and tells her who to call first.
