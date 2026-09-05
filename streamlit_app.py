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

import hashlib
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


_ROOT = os.path.dirname(os.path.abspath(__file__))
_SOURCES = [
    "scripts/dashboard_template.html", "scripts/export_web.py",
    "wealth_intelligence/data_model.py", "wealth_intelligence/detectors.py",
    "wealth_intelligence/detectors_extra.py", "wealth_intelligence/scenarios.py",
    "wealth_intelligence/lookthrough.py", "wealth_intelligence/explainer.py",
]


def _code_version() -> str:
    """A fingerprint of the source files, so the cache rebuilds when they change
    (a bare @st.cache_data would otherwise serve a stale page after an edit —
    e.g. keeping the old UI without the scenario toggle until the server is
    restarted)."""
    h = hashlib.sha256()
    for rel in _SOURCES:
        try:
            h.update(f"{rel}:{os.path.getmtime(os.path.join(_ROOT, rel)):.0f}".encode())
        except OSError:
            pass
    return h.hexdigest()[:12]


@st.cache_data(show_spinner="Analysing the book…")
def _dashboard_html(version: str) -> str:
    book = load_book()
    return render_html(build_payload(book))


components.html(_dashboard_html(_code_version()), height=1600, scrolling=True)
