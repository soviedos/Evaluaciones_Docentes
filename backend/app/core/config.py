"""Shim → app.shared.core.config (canonical location)."""
from app.shared.core.config import *  # noqa: F401,F403
from app.shared.core.config import settings  # noqa: F401 — re-export singleton
