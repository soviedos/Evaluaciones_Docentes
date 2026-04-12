"""Domain exceptions — shared kernel.

Only truly cross-cutting errors live here.  Module-specific errors
(e.g. Gemini, Modalidad) are defined in their respective modules
and re-exported here for backward compatibility.
"""

from __future__ import annotations


class DomainError(Exception):
    """Base class for all domain errors."""

    def __init__(self, detail: str = "Error de dominio"):
        self.detail = detail
        super().__init__(detail)


class NotFoundError(DomainError):
    """Resource does not exist."""

    def __init__(self, resource: str = "Recurso", resource_id: str = ""):
        detail = f"{resource} no encontrado" + (f": {resource_id}" if resource_id else "")
        super().__init__(detail)


class DuplicateError(DomainError):
    """Resource already exists (e.g. duplicate hash)."""

    def __init__(self, detail: str = "El recurso ya existe"):
        super().__init__(detail)


class ValidationError(DomainError):
    """Business-rule validation failure."""

    def __init__(self, detail: str = "Error de validación"):
        super().__init__(detail)


# ── Lazy re-exports for backward compatibility ───────────────────────
# Canonical location: app.modules.evaluacion_docente.domain.exceptions
def __getattr__(name: str):  # noqa: N807
    _module_exceptions = {
        "ModalidadRequeridaError",
        "ModalidadInvalidaError",
        "GeminiError",
        "GeminiTimeoutError",
        "GeminiRateLimitError",
        "GeminiUnavailableError",
    }
    if name in _module_exceptions:
        from app.modules.evaluacion_docente.domain import exceptions as _mod

        return getattr(_mod, name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
