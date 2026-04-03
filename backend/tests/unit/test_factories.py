"""Unit tests for entity factories — make sure our test helpers work correctly."""

import uuid

from tests.fixtures.factories import make_documento, make_evaluacion


class TestMakeDocumento:
    def test_default_values(self):
        doc = make_documento()
        assert isinstance(doc.id, uuid.UUID)
        assert doc.nombre_archivo.endswith(".pdf")
        assert len(doc.hash_sha256) == 64
        assert doc.estado == "subido"
        assert doc.tamano_bytes == 1024

    def test_override_fields(self):
        doc = make_documento(nombre_archivo="custom.pdf", estado="procesado")
        assert doc.nombre_archivo == "custom.pdf"
        assert doc.estado == "procesado"

    def test_unique_hashes(self):
        doc1 = make_documento()
        doc2 = make_documento()
        assert doc1.hash_sha256 != doc2.hash_sha256


class TestMakeEvaluacion:
    def test_default_values(self):
        eval_ = make_evaluacion(documento_id=uuid.uuid4())
        assert eval_.docente_nombre == "Prof. García"
        assert eval_.periodo == "2025-2"
        assert eval_.puntaje_general == 4.5

    def test_override_fields(self):
        eval_ = make_evaluacion(
            documento_id=uuid.uuid4(),
            docente_nombre="Prof. López",
            puntaje_general=3.8,
        )
        assert eval_.docente_nombre == "Prof. López"
        assert eval_.puntaje_general == 3.8
