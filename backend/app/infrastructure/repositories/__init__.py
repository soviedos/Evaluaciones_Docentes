"""Re-export barrel — repositories from shared + module."""
from app.modules.evaluacion_docente.infrastructure.repositories.alerta_repo import AlertaRepository
from app.modules.evaluacion_docente.infrastructure.repositories.analytics_repo import (
    AnalyticsRepository,
)
from app.modules.evaluacion_docente.infrastructure.repositories.documento import DocumentoRepository
from app.modules.evaluacion_docente.infrastructure.repositories.duplicado_repo import (
    DuplicadoRepository,
)
from app.modules.evaluacion_docente.infrastructure.repositories.evaluacion import (
    EvaluacionRepository,
)
from app.shared.infrastructure.repositories.base import BaseRepository

__all__ = [
    "AlertaRepository",
    "AnalyticsRepository",
    "BaseRepository",
    "DocumentoRepository",
    "DuplicadoRepository",
    "EvaluacionRepository",
]
