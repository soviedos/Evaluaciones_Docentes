"""Shim → app.shared.core (canonical location)."""
from app.shared.core import get_logger, settings, setup_logging

__all__ = ["get_logger", "settings", "setup_logging"]
