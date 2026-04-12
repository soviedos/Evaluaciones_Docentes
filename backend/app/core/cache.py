"""Shim → app.shared.core.cache (canonical location)."""
from app.shared.core.cache import *  # noqa: F401,F403
from app.shared.core.cache import analytics_cache  # noqa: F401 — re-export singleton
