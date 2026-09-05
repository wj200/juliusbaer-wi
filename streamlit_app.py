"""RM Intelligence Workbench (Phase 3) — dark command deck + live AI layer.

    pip install -r requirements-app.txt
    export ANTHROPIC_API_KEY=sk-ant-...        # or set it in Streamlit Secrets
    streamlit run streamlit_app.py

The visual dashboard (call queue, charts, signals, scenario toggle) is a single
self-contained page rendered in a component iframe — that page is deterministic
and cannot reach the network. The AI explanation layer runs in Python here: the
"Generate live explanation" button makes a real Claude call for the focused
client and feeds the grounded, probabilistic text back into the dashboard.
Without a key it degrades to the deterministic offline explanation.
"""

from __future__ import annotations

import os
import sys
import time

import streamlit as st
import streamlit.components.v1 as components

# Bridge Streamlit Secrets → environment so the explainer picks up a Cloud-set key.
try:
    _key = st.secrets.get("ANTHROPIC_API_KEY")  # type: ignore[attr-defined]
    if _key and not os.environ.get("ANTHROPIC_API_KEY"):
        os.environ["ANTHROPIC_API_KEY"] = _key
except Exception:
    pass

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts"))
from export_web import build_payload, render_html  # noqa: E402
from wealth_intelligence.data_model import load_book  # noqa: E402
from wealth_intelligence.engine import analyse_book, analyse_client  # noqa: E402
from wealth_intelligence.explainer import explain  # noqa: E402

st.set_page_config(page_title="Wealth Intelligence · Workbench", page_icon="🛰️", layout="wide")
st.markdown(
    """
    <style>
      #MainMenu, header, footer {visibility:hidden;}
      .stApp {background:#0b111b;}
      .block-container {padding:8px 18px 0 !important; max-width:100% !important;}
      [data-testid="stAppViewBlockContainer"] {padding:0 !important;}
      iframe {border:none !important;}
      .ctlbar label, .ctlbar p {color:#a7adba !important;}
      div[data-testid="stHorizontalBlock"] {align-items:end;}
    </style>
    """,
    unsafe_allow_html=True,
)


@st.cache_resource(show_spinner=False)
def _book():
    return load_book()


@st.cache_resource(show_spinner=False)
def _ranked():
    return analyse_book(_book())


book = _book()
dossiers = _ranked()
name_of = {d.client_id: d.client_name for d in dossiers}
ranked_ids = [d.client_id for d in dossiers]

ss = st.session_state
ss.setdefault("focus", ranked_ids[0])
ss.setdefault("live", {})     # client_id -> explanation dict (grounded, from a live call)
ss.setdefault("status", "")

key_present = bool(os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("ANTHROPIC_AUTH_TOKEN"))

# ---------------------------------------------------------------- control bar
st.markdown('<div class="ctlbar"></div>', unsafe_allow_html=True)
c1, c2, c3, c4 = st.columns([4, 2.2, 2.2, 3.4])
with c1:
    focus = st.selectbox(
        "Client focus (for live explanation)", ranked_ids,
        index=ranked_ids.index(ss.focus) if ss.focus in ranked_ids else 0,
        format_func=lambda cid: f"#{ranked_ids.index(cid)+1}  {name_of[cid]}",
    )
    ss.focus = focus
with c2:
    gen_one = st.button("⟳ Generate live explanation", use_container_width=True, type="primary")
with c3:
    gen_top = st.button("⟳ Generate top 5 (live)", use_container_width=True)
with c4:
    st.caption(
        ("🟢 Live key detected — explanations call Claude in real time."
         if key_present else
         "⚪ No API key — using deterministic offline explanations. Set ANTHROPIC_API_KEY in Secrets.")
        + (("  ·  " + ss.status) if ss.status else "")
    )


def _regen(cid: str):
    t = time.time()
    e = explain(book, analyse_client(book, cid), use_cache=False)  # force a fresh call
    ss.live[cid] = e.as_dict()
    return e.grounded_by_model, time.time() - t


if gen_one:
    with st.spinner(f"Calling Claude for {name_of[focus]}…"):
        grounded, secs = _regen(focus)
    ss.status = (f"◇ {name_of[focus]}: {'grounded by Claude' if grounded else 'offline fallback'} · {secs:.1f}s")
    st.rerun()

if gen_top:
    with st.spinner("Calling Claude for the top 5 priority clients…"):
        n = 0
        for cid in ranked_ids[:5]:
            g, _ = _regen(cid); n += int(g)
    ss.status = f"◇ Regenerated top 5 · {n} grounded by Claude"
    st.rerun()

# ---------------------------------------------------------------- dashboard
html = render_html(build_payload(book, live=ss.live, focus=ss.focus))
components.html(html, height=1600, scrolling=True)
