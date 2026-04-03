"""Entity factories for tests.

Usage:
    doc = make_documento(nombre_archivo="mi_archivo.pdf")
    eval_ = make_evaluacion(documento_id=doc.id, docente_nombre="Prof. López")

All fields have sensible defaults so you only override what matters for each test.
"""

import hashlib
import uuid

from app.domain.entities.documento import Documento
from app.domain.entities.evaluacion import Evaluacion


def make_documento(**overrides) -> Documento:
    """Build a Documento with defaults. Pass keyword args to override any field."""
    uid = overrides.pop("id", uuid.uuid4())
    defaults = {
        "id": uid,
        "nombre_archivo": f"test_{uid.hex[:8]}.pdf",
        "hash_sha256": overrides.pop("hash_sha256", hashlib.sha256(uid.bytes).hexdigest()),
        "storage_path": f"evaluaciones/{uid.hex[:8]}.pdf",
        "estado": "subido",
        "tamano_bytes": 1024,
    }
    defaults.update(overrides)
    return Documento(**defaults)


def make_evaluacion(**overrides) -> Evaluacion:
    """Build an Evaluacion with defaults. Requires ``documento_id``."""
    uid = overrides.pop("id", uuid.uuid4())
    defaults = {
        "id": uid,
        "docente_nombre": "Prof. García",
        "periodo": "2025-2",
        "materia": "Ingeniería de Software",
        "puntaje_general": 4.5,
        "estado": "pendiente",
    }
    defaults.update(overrides)
    return Evaluacion(**defaults)
