"""Re-export barrel — entities from shared + module canonical locations."""
from app.modules.evaluacion_docente.domain.entities.alerta import Alerta
from app.modules.evaluacion_docente.domain.entities.comentario_analisis import ComentarioAnalisis
from app.modules.evaluacion_docente.domain.entities.document_processing_job import (
    DocumentProcessingJob,
)
from app.modules.evaluacion_docente.domain.entities.documento import Documento
from app.modules.evaluacion_docente.domain.entities.duplicado_probable import DuplicadoProbable
from app.modules.evaluacion_docente.domain.entities.evaluacion import Evaluacion
from app.modules.evaluacion_docente.domain.entities.evaluacion_curso import EvaluacionCurso
from app.modules.evaluacion_docente.domain.entities.evaluacion_dimension import EvaluacionDimension
from app.modules.evaluacion_docente.domain.entities.gemini_audit_log import GeminiAuditLog
from app.shared.domain.entities.base import Base

__all__ = [
    "Alerta",
    "Base",
    "ComentarioAnalisis",
    "DocumentProcessingJob",
    "Documento",
    "DuplicadoProbable",
    "Evaluacion",
    "EvaluacionCurso",
    "EvaluacionDimension",
    "GeminiAuditLog",
]
