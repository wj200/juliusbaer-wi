const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.33, height: 7.5 });
p.layout = "W";
const W = 13.33, H = 7.5;

// ---- palette (no # per pptxgenjs) ----
const NAVY="0C1320", PANEL="16233A", PANEL2="1B2A42", GOLD="C9A86A", GOLDDK="8F7A45",
      IVORY="ECE7DD", SOFT="A7ADBA", MUTE="7C8492", LINE="2A3752",
      CRIMSON="B0453B", AMBER="CF8A3C", STEEL="7F9BB3", SAGE="5F8F7A";
const HEAD="Cambria", BODY="Calibri";

function bg(s, c=NAVY){ s.background = { color: c }; }
function chip(s, x, y, txt, sz=0.34){ // small gold rounded square with a mono glyph
  s.addShape(p.ShapeType.roundRect, { x, y, w: sz, h: sz, rectRadius:0.05, fill:{color:GOLD}, line:{type:"none"} });
  s.addText(txt, { x, y, w: sz, h: sz, align:"center", valign:"middle", fontFace:BODY, bold:true, color:NAVY, fontSize:13, isTextBox:true, margin:0 });
}
function kicker(s, txt, x=0.62, y=0.5){
  s.addText(txt.toUpperCase(), { x, y, w:10, h:0.3, fontFace:BODY, color:GOLD, fontSize:11.5, charSpacing:3, bold:true, isTextBox:true, margin:0 });
}
function title(s, txt, x=0.6, y=0.82, w=12, size=32){
  s.addText(txt, { x, y, w, h:1.0, fontFace:HEAD, color:IVORY, fontSize:size, bold:true, isTextBox:true, margin:0, lineSpacing:size*1.05 });
}
function card(s, x, y, w, h, fill=PANEL){
  s.addShape(p.ShapeType.roundRect, { x, y, w, h, rectRadius:0.09, fill:{color:fill}, line:{color:LINE, width:1} });
}
function foot(s, n){
  s.addText("Wealth Intelligence · Julius Baer · Track #1", { x:0.6, y:H-0.42, w:8, h:0.3, fontFace:BODY, color:MUTE, fontSize:9, isTextBox:true, margin:0 });
  s.addText(String(n).padStart(2,"0"), { x:W-1.1, y:H-0.42, w:0.5, h:0.3, align:"right", fontFace:BODY, color:MUTE, fontSize:9, isTextBox:true, margin:0 });
}

const IMG = "/tmp/claude-0/-home-user-juliusbaer/ce358b8c-70a4-5ca7-9728-984bd98dfdd2/scratchpad/";

// ============================================================ 1 · TITLE
(() => {
  const s = p.addSlide(); bg(s, "0A111C");
  // orbit motif (logo echo), right side
  [ {rx:2.6, ry:1.05, rot:28, c:GOLD, w:1.5},
    {rx:2.6, ry:1.05, rot:-32, c:STEEL, w:1.2},
    {rx:2.6, ry:1.05, rot:80, c:GOLDDK, w:1} ].forEach(o=>{
    s.addShape(p.ShapeType.ellipse, { x:9.7-o.rx, y:2.4-o.ry, w:o.rx*2, h:o.ry*2, fill:{type:"none"}, line:{color:o.c, width:o.w, transparency:35}, rotate:o.rot });
  });
  s.addShape(p.ShapeType.ellipse, { x:9.7-0.22, y:2.4-0.22, w:0.44, h:0.44, fill:{color:GOLD}, line:{type:"none"} });

  s.addText("SINGHACKS 2026   ·   TRACK #1   ·   JULIUS BAER", { x:0.9, y:1.5, w:9, h:0.3, fontFace:BODY, color:GOLD, fontSize:13, charSpacing:3, bold:true, isTextBox:true, margin:0 });
  s.addText("Wealth Intelligence", { x:0.85, y:2.4, w:11, h:1.5, fontFace:HEAD, color:IVORY, fontSize:60, bold:true, isTextBox:true, margin:0 });
  s.addText("From portfolio monitoring to intelligence — reimagining wealth advisory.", { x:0.9, y:3.9, w:9.6, h:0.6, fontFace:HEAD, italic:true, color:SOFT, fontSize:20, isTextBox:true, margin:0 });
  s.addText([
    {text:"The intelligence layer between portfolio data and the Relationship Manager. ", options:{color:SOFT}},
    {text:"A deterministic engine computes every signal; a language model only explains it.", options:{color:IVORY, bold:true}},
  ], { x:0.9, y:4.9, w:9.4, h:0.8, fontFace:BODY, fontSize:14.5, isTextBox:true, margin:0, lineSpacing:22 });
  s.addText("20 clients · 24 portfolios · 1,015 positions · 8 deterministic detectors · Streamlit + Claude", { x:0.9, y:6.2, w:11, h:0.3, fontFace:BODY, color:MUTE, fontSize:11.5, isTextBox:true, margin:0 });
  s.addNotes("Opening. We built Wealth Intelligence for the Julius Baer track: an intelligence layer that sits between raw portfolio data and the Relationship Manager. The whole thesis is one sentence — a deterministic engine computes every signal from the bank's own files, and a language model is only ever used to explain those signals, never to invent them. That single design decision is what makes every insight defensible in a compliance review.");
})();

// ============================================================ 2 · THE CHALLENGE
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "01 · The case"); title(s, "One RM, twenty clients, and tools that only describe");
  s.addText([
    {text:"Priscilla Ong covers 20 private-banking clients across Singapore and Hong Kong. ", options:{}},
    {text:"Today is 26 August 2026", options:{bold:true, color:IVORY}},
    {text:", and she has client meetings over the next fortnight.", options:{}},
  ], { x:0.6, y:2.05, w:6.7, h:1.0, fontFace:BODY, color:SOFT, fontSize:15, isTextBox:true, margin:0, lineSpacing:24 });
  s.addText("Existing tools show valuations, performance and allocations — they are descriptive. She must manually interpret risk, market impact, tax and the next action, across mandates, currencies and structured products.", { x:0.6, y:3.15, w:6.7, h:1.4, fontFace:BODY, color:SOFT, fontSize:15, isTextBox:true, margin:0, lineSpacing:24 });

  // the shift quote
  card(s, 0.6, 4.7, 6.7, 1.9, PANEL2);
  s.addText("“What does my client's portfolio look like?”", { x:0.9, y:4.95, w:6.1, h:0.5, fontFace:HEAD, italic:true, color:MUTE, fontSize:17, isTextBox:true, margin:0 });
  s.addText("→  “What should I know, and what should I do next?”", { x:0.9, y:5.6, w:6.1, h:0.7, fontFace:HEAD, italic:true, color:GOLD, bold:true, fontSize:19, isTextBox:true, margin:0 });

  // stat callouts right
  const stats = [["20","clients, one RM"],["USD 596M","total AUM"],["5","dated snapshots of a turbulent 2026"]];
  stats.forEach((st,i)=>{ const y=2.05+i*1.55; card(s, 7.7, y, 5.0, 1.35);
    s.addText(st[0], { x:8.0, y:y+0.16, w:4.4, h:0.7, fontFace:HEAD, color:GOLD, bold:true, fontSize:34, isTextBox:true, margin:0 });
    s.addText(st[1], { x:8.0, y:y+0.9, w:4.4, h:0.35, fontFace:BODY, color:SOFT, fontSize:12.5, isTextBox:true, margin:0 });
  });
  foot(s,2);
  s.addNotes("The case scenario. Priscilla is a realistic private-banking RM — twenty clients, from an eight-million-dollar individual to an eighty-eight-million family office. Her existing tools are descriptive: they tell her what a portfolio looks like, not what matters or what to do. The challenge, in Julius Baer's own words, is to move her from 'what does the portfolio look like' to 'what should I know and what should I do next'. And the data has a time dimension — five snapshots across a 2026 energy shock, a Hormuz closure and a tech drawdown — so the interesting signal lives in the change, not the snapshot.");
})();

// ============================================================ 3 · THE ANSWER (process)
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "02 · Our answer"); title(s, "An intelligence layer: signal → understanding → decision");
  const steps = [
    ["Signal","The engine computes every risk & opportunity from the files — collateral, concentration, liquidity, income, mandate, currency, events.","1"],
    ["Understanding","A grounded explanation turns those facts into a plain-English read an RM can defend — what's happening and why it matters to THIS client.","2"],
    ["Decision","The RM triages the whole book, drills into a client, and accepts, edits or dismisses each insight. She stays in control; she owns the advice.","3"],
  ];
  steps.forEach((st,i)=>{ const x=0.6+i*4.16, w=3.9, y=2.4;
    card(s, x, y, w, 3.4);
    chip(s, x+0.35, y+0.35, st[2], 0.5);
    s.addText(st[0], { x:x+0.35, y:y+1.05, w:w-0.7, h:0.5, fontFace:HEAD, color:IVORY, bold:true, fontSize:22, isTextBox:true, margin:0 });
    s.addText(st[1], { x:x+0.35, y:y+1.7, w:w-0.7, h:1.5, fontFace:BODY, color:SOFT, fontSize:13.5, isTextBox:true, margin:0, lineSpacing:20 });
    if(i<2) s.addText("→", { x:x+w-0.12, y:y+1.35, w:0.5, h:0.5, align:"center", fontFace:BODY, color:GOLD, bold:true, fontSize:26, isTextBox:true, margin:0 });
  });
  s.addText([{text:"The differentiator:  ", options:{bold:true, color:GOLD}},{text:"the deterministic engine decides what is true; the language model only explains it.", options:{color:IVORY}}], { x:0.6, y:6.15, w:12, h:0.5, fontFace:BODY, fontSize:15, isTextBox:true, margin:0 });
  foot(s,3);
  s.addNotes("Our answer is an intelligence layer with three stages. Signal — a deterministic engine reads the twelve source files and computes every risk and opportunity. Understanding — a grounded explanation turns those computed facts into language the RM can actually use in a meeting. Decision — the RM triages the book, drills into a client, and accepts, edits or dismisses each insight. The line at the bottom is the thing to remember: the engine decides what's true; the model only narrates it.");
})();

// ============================================================ 4 · THE PRODUCT (screenshot)
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "03 · The product"); title(s, "The RM workbench — who to call first, and why");
  s.addImage({ path: IMG+"deck_workbench.png", x:0.6, y:1.85, w:9.2, h:9.2/1.44, rounding:true });
  // right rail highlights
  const hl = [["Call queue","20 clients ranked by Σ severity² — filterable, sortable, searchable."],
              ["Live dossier","Value across snapshots, an LTV gauge, look-through exposure."],
              ["Every 'Why?'","Each signal opens to its exact facts and source rows."],
              ["In control","Accept · Edit · Dismiss feeds a live meeting-prep list."]];
  hl.forEach((h,i)=>{ const y=1.9+i*1.25; s.addText(h[0], { x:10.0, y, w:2.9, h:0.35, fontFace:HEAD, bold:true, color:GOLD, fontSize:15, isTextBox:true, margin:0 });
    s.addText(h[1], { x:10.0, y:y+0.36, w:2.95, h:0.85, fontFace:BODY, color:SOFT, fontSize:11.5, isTextBox:true, margin:0, lineSpacing:16 }); });
  foot(s,4);
  s.addNotes("This is the working product — a live Streamlit workbench, not a mockup. On the left is the call queue: all twenty clients ranked by a transparent priority score, and you can filter, sort and search. Select a client and the dossier shows the portfolio value across the five snapshots, a loan-to-value gauge against the margin-call line, and single-name exposure looked through the structured products. Every signal opens to the exact numbers behind it, and the RM accepts, edits or dismisses each one — which builds her meeting-prep list. Demo tip: open on Lau Chi Ming, the client at the top.");
})();

// ============================================================ 5 · HOW · ARCHITECTURE
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "04 · How it works · architecture"); title(s, "One path down: data → engine → boundary → explanation → RM");
  s.addImage({ path: IMG+"deck_architecture.png", x:8.05, y:1.15, w:4.75, h:4.75/0.987 > 6.1 ? 6.1 : 4.75/0.987, sizing:{type:"contain", w:4.75, h:6.1} });
  const rows = [
    ["12 source files","Holdings, credit facilities, mandates, transactions, the authoritative event log, RM notes — joined into one currency-aware model."],
    ["Deterministic engine","Eight detectors compute every signal and rank the book by Σ severity². Every finding carries its facts and its source rows."],
    ["Governance boundary","Above it, everything is deterministic and auditable. Below it, a single LLM explains — handed facts, never asked to compute."],
    ["RM workbench","Triage → client story → Accept / Edit / Dismiss. The RM decides and owns the advice."],
  ];
  rows.forEach((r,i)=>{ const y=1.9+i*1.18; chip(s, 0.6, y+0.02, String(i+1), 0.34);
    s.addText(r[0], { x:1.1, y:y-0.05, w:6.6, h:0.4, fontFace:HEAD, bold:true, color:IVORY, fontSize:16, isTextBox:true, margin:0 });
    s.addText(r[1], { x:1.1, y:y+0.35, w:6.7, h:0.8, fontFace:BODY, color:SOFT, fontSize:12.5, isTextBox:true, margin:0, lineSpacing:17 }); });
  foot(s,5);
  s.addNotes("How it works, at the top level. Twelve files are joined into one currency-aware model. A deterministic engine of eight detectors computes every signal and ranks the book. Then the governance boundary — the dashed line in the diagram — separates the deterministic engine above from a single language-model component below. The model is handed the findings as facts to explain; it never computes a number. Finally the workbench, where the RM decides. If you remove the model entirely, the engine still produces the whole triage — you just lose the narration.");
})();

// ============================================================ 6 · HOW · DETECTORS
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "04 · How it works · the engine"); title(s, "Eight deterministic detectors — every number from the files");
  const det = [
    ["Collateral","LTV vs the margin-call line, across 5 snapshots", CRIMSON],
    ["Concentration","Single-name exposure, looking through notes", AMBER],
    ["Mandate","Band & single-position + ESG-exclusion breaches", GOLD],
    ["Liquidity","Sellable assets net of pledged collateral", STEEL],
    ["Income","Drawdown vs the income the book actually pays", AMBER],
    ["Attribution","Biggest moves tied to the authoritative events", STEEL],
    ["Currency","Obligations in a currency the book barely holds", GOLD],
    ["Review","KYC / periodic review due or overdue", SAGE],
  ];
  det.forEach((d,i)=>{ const col=i%4, row=Math.floor(i/4); const x=0.6+col*3.08, y=2.1+row*2.05, w=2.86, h=1.8;
    card(s, x, y, w, h);
    s.addShape(p.ShapeType.roundRect, { x:x+0.28, y:y+0.28, w:0.16, h:0.16, rectRadius:0.03, fill:{color:d[2]}, line:{type:"none"} });
    s.addText(d[0], { x:x+0.55, y:y+0.2, w:w-0.7, h:0.4, fontFace:HEAD, bold:true, color:IVORY, fontSize:16, isTextBox:true, margin:0 });
    s.addText(d[1], { x:x+0.28, y:y+0.75, w:w-0.5, h:0.9, fontFace:BODY, color:SOFT, fontSize:12, isTextBox:true, margin:0, lineSpacing:16 });
  });
  s.addText([{text:"Ranking = Σ severity²  ", options:{bold:true, color:GOLD}},{text:"— one genuine emergency outranks a pile of minor drift, and the order is always explainable.", options:{color:SOFT}}], { x:0.6, y:6.5, w:12, h:0.4, fontFace:BODY, fontSize:13.5, isTextBox:true, margin:0 });
  foot(s,6);
  s.addNotes("The engine is eight deterministic detectors. Collateral tracks loan-to-value against the margin-call line. Concentration looks through structured products to the real single name. Mandate catches band, single-position and sustainable-exclusion breaches. Liquidity nets out pledged collateral. Income compares the client's drawdown to the income the portfolio actually pays. Attribution ties the biggest moves to the authoritative event log. Currency flags obligations in a currency the book barely holds. And Review surfaces KYC that's due. The book-wide ranking is the sum of severity squared, so one real emergency beats a stack of minor drift — and we can always defend the order.");
})();

// ============================================================ 7 · HOW · DATA TRAPS
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "04 · How it works · getting it right"); title(s, "Four data traps we handle — where understanding shows");
  const traps = [
    ["Currency","Naïve reading: a HK book 'fell' 206m → 26m.","We value from market_value_usd, never the base-currency AUM columns — an FX conversion is not a loss."],
    ["Custody vs managed","Naïve reading: a 41% family stake is a breach.","It sits in a custody account — outside mandate governance. A concentration to discuss, not a breach to correct."],
    ["Encumbered liquidity","Naïve reading: USD 19m looks 'sellable'.","Most is pledged to a Lombard loan. Net it out → USD 12m genuinely free."],
    ["Look-through","Naïve reading: three small positions.","Stock + perpetual + accumulator = one ~29% bet on a single name."],
  ];
  traps.forEach((t,i)=>{ const col=i%2, row=Math.floor(i/2); const x=0.6+col*6.15, y=2.05+row*2.35, w=5.9, h=2.1;
    card(s, x, y, w, h);
    s.addText(t[0], { x:x+0.3, y:y+0.22, w:w-0.6, h:0.4, fontFace:HEAD, bold:true, color:GOLD, fontSize:17, isTextBox:true, margin:0 });
    s.addText([{text:"✕  ", options:{color:CRIMSON, bold:true}},{text:t[1], options:{color:MUTE, italic:true}}], { x:x+0.3, y:y+0.72, w:w-0.6, h:0.5, fontFace:BODY, fontSize:12.5, isTextBox:true, margin:0, lineSpacing:17 });
    s.addText([{text:"✓  ", options:{color:SAGE, bold:true}},{text:t[2], options:{color:IVORY}}], { x:x+0.3, y:y+1.25, w:w-0.6, h:0.7, fontFace:BODY, fontSize:12.5, isTextBox:true, margin:0, lineSpacing:17 });
  });
  foot(s,7);
  s.addNotes("This slide is where judgement shows, because the dataset sets traps. Currency: a Hong Kong book looks like it collapsed from 206 million to 26 million — but that's just HKD converted to USD, not a loss, so we always value from the USD column. Custody: a client's 41% stake in the family company looks like a breach, but it's in a custody account outside mandate governance — a conversation, not a correction. Liquidity: nineteen million looks sellable until you realise it's pledged to a loan — netted out, only twelve is free. And look-through: three small-looking positions are actually one 29% bet once you see the stock, the perpetual and the accumulator are the same name. Getting these right is what separates arithmetic from understanding.");
})();

// ============================================================ 8 · HOW · GOVERNANCE BOUNDARY
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "04 · How it works · the boundary"); title(s, "The model explains. It never computes.");
  // two zones
  card(s, 0.6, 2.1, 5.75, 4.2, PANEL2);
  s.addText("DETERMINISTIC ENGINE", { x:0.9, y:2.35, w:5.2, h:0.35, fontFace:BODY, bold:true, charSpacing:2, color:GOLD, fontSize:12, isTextBox:true, margin:0 });
  ["Every signal computed from the files","Each finding carries facts + evidence rows","Reproducible, testable, auditable","16→19 regression tests pin the behaviour"].forEach((t,i)=>{
    s.addText([{text:"◆  ", options:{color:GOLD}},{text:t, options:{color:IVORY}}], { x:0.95, y:2.85+i*0.72, w:5.1, h:0.5, fontFace:BODY, fontSize:14, isTextBox:true, margin:0 }); });

  s.addShape(p.ShapeType.line, { x:6.55, y:2.2, w:0, h:4.0, line:{color:GOLD, width:1.5, dashType:"dash"} });
  s.addText("facts →", { x:6.15, y:4.0, w:0.9, h:0.3, align:"center", fontFace:BODY, italic:true, color:GOLD, fontSize:11, isTextBox:true, margin:0 });

  card(s, 6.95, 2.1, 5.75, 4.2, PANEL);
  s.addText("LANGUAGE MODEL — EXPLANATION ONLY", { x:7.25, y:2.35, w:5.2, h:0.35, fontFace:BODY, bold:true, charSpacing:2, color:STEEL, fontSize:12, isTextBox:true, margin:0 });
  ["Turns findings into a plain-English read","Cites only the facts it was handed","Refuses / flags uncertainty honestly","Cached + deterministic offline fallback"].forEach((t,i)=>{
    s.addText([{text:"◆  ", options:{color:STEEL}},{text:t, options:{color:IVORY}}], { x:7.3, y:2.85+i*0.72, w:5.1, h:0.5, fontFace:BODY, fontSize:14, isTextBox:true, margin:0 }); });

  s.addText([{text:"Trade-off:  ", options:{bold:true, color:AMBER}},{text:"the model can't surface a signal the detectors don't encode — accepted, deliberately, in exchange for an insight an RM can always defend.", options:{color:SOFT}}], { x:0.6, y:6.55, w:12, h:0.5, fontFace:BODY, fontSize:13.5, isTextBox:true, margin:0 });
  foot(s,8);
  s.addNotes("This is the single most important design decision, and the reason the whole thing is defensible inside a bank. On the left, the deterministic engine computes every signal from the files, and every finding ships with its facts and its source rows — reproducible, testable, auditable. The dashed line is the governance boundary: only the computed facts cross it. On the right, the language model does exactly one job — it explains those facts in plain language, cites only what it was given, and is honest about uncertainty. It can't hallucinate a number because it never sees the job of producing one. The trade-off, stated openly: the model can't surface a signal we didn't encode. We accept that, because a bank cannot put an unexplainable insight in front of a client.");
})();

// ============================================================ 9 · DESIGN DECISIONS + TRADE-OFFS
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "05 · Design decisions & trade-offs"); title(s, "Every choice made for a regulated environment");
  const rows = [
    ["Deterministic engine; LLM only explains","Every insight is defensible in a compliance review.","An extra layer; the model can't surface an un-coded signal."],
    ["Pure standard-library core (no pandas)","Runs anywhere a bank permits Python; trivial to audit.","A little CSV & FX plumbing written by hand."],
    ["Explicit, auditable look-through table","No free-association about what a note references.","A curated map to maintain as instruments change."],
    ["Explanations cached + offline fallback","A live demo never depends on the network.","Cached text keyed by input hash to stay fresh."],
    ["Evidence + facts on every finding","Full traceability from insight back to source rows.","Slightly more verbose findings."],
  ];
  // header row
  const cols=[[0.6,4.7,"DECISION"],[5.4,4.0,"WHY"],[9.5,3.2,"TRADE-OFF"]];
  cols.forEach(c=> s.addText(c[2], { x:c[0], y:1.9, w:c[1], h:0.3, fontFace:BODY, bold:true, charSpacing:2, color:GOLD, fontSize:11, isTextBox:true, margin:0 }));
  rows.forEach((r,i)=>{ const y=2.35+i*0.92;
    if(i%2===0) s.addShape(p.ShapeType.roundRect,{x:0.55,y:y-0.08,w:12.2,h:0.86,rectRadius:0.04,fill:{color:PANEL},line:{type:"none"}});
    s.addText(r[0], { x:0.7, y, w:4.6, h:0.8, fontFace:BODY, bold:true, color:IVORY, fontSize:12.5, isTextBox:true, margin:0, valign:"middle", lineSpacing:15 });
    s.addText(r[1], { x:5.4, y, w:4.0, h:0.8, fontFace:BODY, color:SOFT, fontSize:12, isTextBox:true, margin:0, valign:"middle", lineSpacing:15 });
    s.addText(r[2], { x:9.5, y, w:3.3, h:0.8, fontFace:BODY, italic:true, color:MUTE, fontSize:11.5, isTextBox:true, margin:0, valign:"middle", lineSpacing:15 });
  });
  foot(s,9);
  s.addNotes("Every design decision was made for a regulated environment, and each one has an honest trade-off. Deterministic engine with the LLM only explaining — defensible, but the model can't surface a signal we didn't code. Pure standard library — runs anywhere and is trivial to audit, at the cost of a little hand-written plumbing. An explicit look-through table — auditable rather than guessed, but it's a map we maintain. Cached explanations with an offline fallback — the demo never depends on the network. And evidence on every finding — full traceability, slightly more verbose. We're not hiding the costs; we're showing we chose deliberately.");
})();

// ============================================================ 10 · UNIQUE FIT FOR JB
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "06 · Why it uniquely fits the challenge"); title(s, "Advisory, not descriptive — and defensible to the client");
  const pts = [
    ["Prioritises the whole book","'Who do I call first, and can I defend the ranking?' — the challenge's own question, answered."],
    ["Every insight is defensible","Grounded in the files and the authoritative event log — an RM can explain it in a meeting."],
    ["Understands the client, not just the maths","Reads mandate, tax domicile, objectives and the RM's own notes — where the real advice lives."],
  ];
  pts.forEach((pt,i)=>{ const y=2.05+i*1.15; chip(s,0.6,y,String(i+1),0.4);
    s.addText(pt[0], { x:1.2, y:y-0.02, w:6.3, h:0.4, fontFace:HEAD, bold:true, color:IVORY, fontSize:16.5, isTextBox:true, margin:0 });
    s.addText(pt[1], { x:1.2, y:y+0.4, w:6.4, h:0.7, fontFace:BODY, color:SOFT, fontSize:12.5, isTextBox:true, margin:0, lineSpacing:17 }); });

  // flagship case card
  card(s, 8.0, 2.05, 4.75, 4.35, PANEL2);
  s.addText("FLAGSHIP · LAU CHI MING", { x:8.3, y:2.3, w:4.2, h:0.3, fontFace:BODY, bold:true, charSpacing:2, color:GOLD, fontSize:11.5, isTextBox:true, margin:0 });
  s.addText("0.6 pts", { x:8.3, y:2.7, w:4.2, h:0.8, fontFace:HEAD, bold:true, color:CRIMSON, fontSize:44, isTextBox:true, margin:0 });
  s.addText("from a margin call — as the 2026 shocks cut his collateral.", { x:8.3, y:3.55, w:4.15, h:0.6, fontFace:BODY, color:IVORY, fontSize:13, isTextBox:true, margin:0, lineSpacing:18 });
  ["≈29% in one name once the stock, perpetual and accumulator are looked through","Only USD 12m genuinely free once the loan is netted","His notes: 'the perpetual, the shares, the accumulator… are the same bet'"].forEach((t,i)=>{
    s.addText([{text:"—  ", options:{color:GOLD}},{text:t, options:{color:SOFT}}], { x:8.3, y:4.25+i*0.72, w:4.2, h:0.65, fontFace:BODY, fontSize:11.5, isTextBox:true, margin:0, lineSpacing:15 }); });
  foot(s,10);
  s.addNotes("Why this uniquely answers Julius Baer's challenge. First, it prioritises the whole book — it answers the brief's own question, who to call first and can you defend the ranking. Second, every insight is defensible, grounded in the files and the authoritative event log. Third, it understands the client, not just the arithmetic — it reads the mandate, the tax domicile, the objectives and the RM's own notes, which is where the real advice lives. The flagship makes it concrete: Lau Chi Ming is six-tenths of a point from a margin call because the 2026 shocks cut his collateral; his portfolio is 29% one name once you look through the structured products; and only twelve million is actually free. The engine surfaces him first — and Priscilla can defend every number.");
})();

// ============================================================ 11 · INTEGRATION INTO JB
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "07 · Built to live inside Julius Baer"); title(s, "Feasibility & compliance, by construction");
  const g = [
    ["Explainability","Every insight is a named detector carrying its facts; the 'Why?' shows them."],
    ["Suitability","Findings respect mandate, risk profile and objectives — so does the model."],
    ["Human oversight","Accept / Edit / Dismiss on every insight; nothing is auto-actioned."],
    ["Traceability","Each finding lists its source rows — e.g. credit_facilities.csv:CF-0002."],
    ["Security","No client data leaves the engine; the API key lives in the environment, never in code."],
    ["Operability","Pure-stdlib engine + one container image; runs on any bank-approved Python host."],
  ];
  g.forEach((c,i)=>{ const col=i%3, row=Math.floor(i/3); const x=0.6+col*4.13, y=2.15+row*2.15, w=3.9, h=1.9;
    card(s, x, y, w, h);
    s.addShape(p.ShapeType.ellipse,{x:x+0.28,y:y+0.28,w:0.34,h:0.34,fill:{color:PANEL2},line:{color:GOLD,width:1}});
    s.addText(String(i+1),{x:x+0.28,y:y+0.28,w:0.34,h:0.34,align:"center",valign:"middle",fontFace:BODY,bold:true,color:GOLD,fontSize:13,isTextBox:true,margin:0});
    s.addText(c[0], { x:x+0.75, y:y+0.28, w:w-0.9, h:0.4, fontFace:HEAD, bold:true, color:IVORY, fontSize:16, isTextBox:true, margin:0 });
    s.addText(c[1], { x:x+0.3, y:y+0.85, w:w-0.55, h:0.95, fontFace:BODY, color:SOFT, fontSize:12, isTextBox:true, margin:0, lineSpacing:16 });
  });
  foot(s,11);
  s.addNotes("Could this actually run inside Julius Baer? We designed for that from the start, and it maps one-to-one onto the bank's own trust requirements. Explainability — every insight is a named detector that carries its facts. Suitability — findings respect the mandate, risk profile and objectives. Human oversight — the RM accepts, edits or dismisses everything; nothing is auto-actioned. Traceability — each finding names its source rows. Security — no client data leaves the engine, and the key lives in the environment, never in the code. And operability — a pure standard-library engine plus a single container image runs on any bank-approved Python host. This isn't a prototype that would need re-architecting; it's shaped like something that could ship.");
})();

// ============================================================ 12 · FIDELITY TO THE CASE
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "08 · Faithful to the case"); title(s, "Back to the brief — and the rubric");
  const left = [
    ["Signal → understanding → decision","the exact advisory flow the brief describes"],
    ["Deep on 2–3 clients","Lau (collateral), Cheung (income suitability), Fong (household liquidity)"],
    ["Grounded in event_log.csv","the authoritative source — no free-association about 2026"],
    ["Notices data imperfections","FX, custody, private-market valuation lag — and says so"],
  ];
  left.forEach((r,i)=>{ const y=2.05+i*1.12; s.addText([{text:"◆  ", options:{color:GOLD}},{text:r[0], options:{bold:true, color:IVORY}}], { x:0.6, y, w:6.6, h:0.4, fontFace:BODY, fontSize:15, isTextBox:true, margin:0 });
    s.addText(r[1], { x:0.95, y:y+0.4, w:6.4, h:0.55, fontFace:BODY, italic:true, color:SOFT, fontSize:12.5, isTextBox:true, margin:0, lineSpacing:16 }); });
  // rubric mapping card
  card(s, 8.0, 2.05, 4.75, 4.5, PANEL);
  s.addText("MAPS TO THE JUDGING RUBRIC", { x:8.3, y:2.3, w:4.2, h:0.3, fontFace:BODY, bold:true, charSpacing:2, color:GOLD, fontSize:11.5, isTextBox:true, margin:0 });
  [["Client-Centric Innovation","advisory triage across the book"],["User Experience & Design","the workbench, 'Why?' on every signal"],["Technical & Operational Feasibility","deterministic, auditable, containerised"],["Strategic Impact","modern JB, RM kept central"]].forEach((r,i)=>{ const y=2.75+i*0.92;
    s.addText(r[0], { x:8.3, y, w:4.2, h:0.35, fontFace:HEAD, bold:true, color:IVORY, fontSize:14, isTextBox:true, margin:0 });
    s.addText(r[1], { x:8.3, y:y+0.34, w:4.2, h:0.5, fontFace:BODY, color:SOFT, fontSize:11.5, isTextBox:true, margin:0, lineSpacing:15 }); });
  foot(s,12);
  s.addNotes("Fidelity to the case. We follow the exact advisory flow the brief describes — signal, understanding, decision. We go deep on the two or three clients the brief tells us to rather than shallow across twenty: Lau for collateral, Cheung for income suitability, Fong for household liquidity. We ground everything in the event log, the authoritative source, so the system never free-associates about 2026. And we notice the data's imperfections — currency, custody, valuation lag — and say so, because the brief rewards noticing. On the right, it maps cleanly onto all four rubric criteria: client-centric innovation, user experience, technical and operational feasibility, and strategic impact.");
})();

// ============================================================ 12b · SCENARIO
(() => {
  const s = p.addSlide(); bg(s);
  kicker(s, "How it works · what could happen next"); title(s, "Scenario toggle — forward-looking, still deterministic");
  s.addImage({ path: IMG+"deck_scenario.png", x:0.6, y:1.85, w:9.2, h:9.2/1.44, rounding:true });
  const hl = [["De-escalation · Today · Escalation","One toggle re-prices every holding under a market shock."],
              ["The gauge crosses the line","Under Escalation, Lau's LTV 69.4% → 70.4% — margin call breached."],
              ["The book re-ranks","Ordered by scenario stress; who is newly at risk rises to the top."],
              ["Still auditable","The shock vector and sensitivities are computed and shown — never by the model."]];
  hl.forEach((h,i)=>{ const y=1.95+i*1.28; s.addText(h[0], { x:10.0, y, w:2.95, h:0.5, fontFace:HEAD, bold:true, color:GOLD, fontSize:14, isTextBox:true, margin:0, lineSpacing:17 });
    s.addText(h[1], { x:10.0, y:y+0.55, w:2.95, h:0.85, fontFace:BODY, color:SOFT, fontSize:11.5, isTextBox:true, margin:0, lineSpacing:15 }); });
  foot(s,13);
  s.addNotes("The scenario toggle adds the 'what could happen next' half of the brief's flow. One control — De-escalation, Today, Escalation — re-prices every holding under a stylised shock vector grounded in the real 2026 moves. The demo moment: flip to Escalation and Lau's loan-to-value swings from 69.4% straight across the 70% margin call, the gauge goes red, and the whole book re-ranks by scenario stress so the newly-at-risk clients rise to the top. And it stays inside the governance boundary — the shocks and sensitivities are deterministic and shown on screen, never produced by the model. It's labelled an illustrative sensitivity, not a full risk engine, which is exactly the honest framing the brief rewards.");
})();

// ============================================================ 13 · CLOSE
(() => {
  const s = p.addSlide(); bg(s, "0A111C");
  [ {rx:2.6, ry:1.05, rot:24, c:GOLD, w:1.4}, {rx:2.6, ry:1.05, rot:-30, c:STEEL, w:1.1} ].forEach(o=>{
    s.addShape(p.ShapeType.ellipse, { x:11.0-o.rx, y:1.7-o.ry, w:o.rx*2, h:o.ry*2, fill:{type:"none"}, line:{color:o.c, width:o.w, transparency:45}, rotate:o.rot }); });
  kicker(s, "The north star", 0.9, 1.5);
  s.addText("Build the intelligence layer between\nportfolio data and the Relationship Manager.", { x:0.85, y:2.1, w:11.5, h:1.7, fontFace:HEAD, bold:true, color:IVORY, fontSize:34, isTextBox:true, margin:0, lineSpacing:40 });
  s.addText("Help RMs understand what matters, anticipate what may happen next, and turn complex portfolios into timely, personalised, trustworthy advice — while the RM stays central, and owns every decision.", { x:0.9, y:3.95, w:9.8, h:1.1, fontFace:BODY, color:SOFT, fontSize:15, isTextBox:true, margin:0, lineSpacing:23 });
  // next
  s.addText("WHAT'S NEXT", { x:0.9, y:5.25, w:5, h:0.3, fontFace:BODY, bold:true, charSpacing:2, color:GOLD, fontSize:11.5, isTextBox:true, margin:0 });
  s.addText("One-page meeting-pack export  ·  household-level tax-lot optimisation  ·  right-sizing the engine to a columnar store behind the same detector interface", { x:0.9, y:5.6, w:11.4, h:0.7, fontFace:BODY, color:IVORY, fontSize:13, isTextBox:true, margin:0, lineSpacing:19 });
  s.addText("Synthetic data throughout · the RM owns the advice", { x:0.9, y:6.7, w:11, h:0.3, fontFace:BODY, italic:true, color:MUTE, fontSize:11, isTextBox:true, margin:0 });
  s.addNotes("To close, the north star from the brief: build the intelligence layer between portfolio data and the Relationship Manager. That's exactly what we built — help RMs understand what matters, anticipate what's next, and turn complex portfolios into timely, personalised, trustworthy advice, with the RM kept central and owning every decision. What's next is a scenario toggle that re-prices exposures for a Middle-East escalation live, a one-page meeting-pack export, and household-level tax optimisation. Everything is synthetic, and the RM always owns the advice. Thank you.");
})();

p.writeFile({ fileName: IMG+"Wealth-Intelligence-Pitch.pptx" }).then(f => console.log("WROTE", f));
