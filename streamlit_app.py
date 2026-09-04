"""RM Intelligence Workbench — the "Command Deck" UI (Phase 3).

    pip install -r requirements-app.txt
    streamlit run streamlit_app.py

This serves the dark, interactive command-deck dashboard: a filterable call
queue and constellation map of the book, and a per-client dossier with live
charts (portfolio value, LTV gauge, look-through exposure), a grounded
explanation, and Accept / Edit / Dismiss on every signal. The whole UI is a
single self-contained page built from the deterministic engine — Streamlit just
serves it, so the Docker / Cloud deploy is unchanged.
"""

from __future__ import annotations

import os
import sys

import streamlit as st
import streamlit.components.v1 as components

# Bridge Streamlit Secrets → environment so the grounded explainer picks up a
# Cloud-set key; locally the env var is used directly (harmless no-op).
try:
    _key = st.secrets.get("ANTHROPIC_API_KEY")  # type: ignore[attr-defined]
    if _key and not os.environ.get("ANTHROPIC_API_KEY"):
        os.environ["ANTHROPIC_API_KEY"] = _key
except Exception:
    pass

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts"))
from export_web import build_payload, render_html  # noqa: E402
from wealth_intelligence.data_model import load_book  # noqa: E402

st.set_page_config(page_title="Wealth Intelligence · Command Deck", page_icon="🛰️", layout="wide")

# Strip Streamlit chrome so the dashboard fills the frame edge to edge.
st.markdown(
    """
    <style>
      #MainMenu, header, footer {visibility:hidden;}
      .stApp {background:#05070e;}
      .block-container {padding:0 !important; max-width:100% !important;}
      [data-testid="stAppViewBlockContainer"] {padding:0 !important;}
      iframe {border:none !important;}
    </style>
    """,
    unsafe_allow_html=True,
)


@st.cache_data(show_spinner="Analysing the book…")
def _dashboard_html() -> str:
    book = load_book()
    return render_html(build_payload(book))


components.html(_dashboard_html(), height=1600, scrolling=True)
