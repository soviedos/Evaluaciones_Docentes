"""Re-export barrel — domain exceptions from shared."""
from app.shared.domain.exceptions import DomainError, DuplicateError, NotFoundError, ValidationError

__all__ = ["DomainError", "DuplicateError", "NotFoundError", "ValidationError"]
