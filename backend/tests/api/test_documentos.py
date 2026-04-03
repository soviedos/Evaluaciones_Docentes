"""API tests — /api/v1/documentos endpoints."""

import pytest

from app.infrastructure.repositories.documento import DocumentoRepository
from tests.fixtures.factories import make_documento

pytestmark = pytest.mark.api


class TestListDocumentos:
    async def test_empty_list(self, client):
        response = await client.get("/api/v1/documentos/")

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0
        assert data["page"] == 1
        assert data["page_size"] == 20

    async def test_with_data(self, client, db):
        repo = DocumentoRepository(db)
        await repo.create(make_documento())
        await repo.create(make_documento())

        response = await client.get("/api/v1/documentos/")

        data = response.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    async def test_pagination_params(self, client, db):
        repo = DocumentoRepository(db)
        for _ in range(5):
            await repo.create(make_documento())

        response = await client.get("/api/v1/documentos/?page=2&page_size=2")

        data = response.json()
        assert data["page"] == 2
        assert data["page_size"] == 2
        assert len(data["items"]) == 2
        assert data["total"] == 5

    async def test_item_shape(self, client, db):
        repo = DocumentoRepository(db)
        await repo.create(make_documento(nombre_archivo="archivo.pdf"))

        response = await client.get("/api/v1/documentos/")

        item = response.json()["items"][0]
        assert item["nombre_archivo"] == "archivo.pdf"
        assert "id" in item
        assert "hash_sha256" in item
        assert "estado" in item
        assert "created_at" in item
