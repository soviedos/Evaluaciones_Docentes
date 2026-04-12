"""Re-export barrel — schemas from shared + module canonical locations."""
from app.modules.evaluacion_docente.domain.schemas.analytics import (
    DimensionPromedio,
    DocentePromedio,
    PeriodoMetrica,
    PeriodoOption,
    RankingDocente,
    ResumenGeneral,
)
from app.modules.evaluacion_docente.domain.schemas.documento import (
    DocumentoCreate,
    DocumentoFilterParams,
    DocumentoList,
    DocumentoRead,
    DocumentoSortField,
    DocumentoUploadResponse,
    DuplicadoRead,
    DuplicadoResumen,
)
from app.modules.evaluacion_docente.domain.schemas.evaluacion import EvaluacionList, EvaluacionRead
from app.shared.domain.schemas.common import (
    BaseSchema,
    ErrorResponse,
    HealthResponse,
    PaginatedItems,
    PaginatedResponse,
)

__all__ = [
    "BaseSchema",
    "DimensionPromedio",
    "DocentePromedio",
    "DocumentoCreate",
    "DocumentoFilterParams",
    "DocumentoList",
    "DocumentoRead",
    "DocumentoSortField",
    "DocumentoUploadResponse",
    "DuplicadoRead",
    "DuplicadoResumen",
    "ErrorResponse",
    "EvaluacionList",
    "EvaluacionRead",
    "HealthResponse",
    "PaginatedItems",
    "PaginatedResponse",
    "PeriodoMetrica",
    "PeriodoOption",
    "RankingDocente",
    "ResumenGeneral",
]
