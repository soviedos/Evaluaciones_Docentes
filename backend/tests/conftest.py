"""Root conftest — shared fixtures for all test layers.

Fixture scopes:
    - ``engine`` / ``tables``: session-scoped — schema created once per test run.
    - ``db``: function-scoped — each test gets a fresh transaction that is
      rolled back automatically (zero leftover data).
    - ``client``: function-scoped — ASGI test client with DB override.
"""

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from app.domain.entities.base import Base
from app.infrastructure.database.session import get_db
from app.main import app

# ---------------------------------------------------------------------------
# Engine (session-scoped — one in-memory DB for the whole test run)
# ---------------------------------------------------------------------------
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def engine():
    """Create a single async engine shared across the entire test session."""
    return create_async_engine(TEST_DATABASE_URL, echo=False)


@pytest.fixture(scope="session", autouse=True)
async def tables(engine):
    """Create all tables once before the first test; drop after the last."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


# ---------------------------------------------------------------------------
# DB session (function-scoped — each test is wrapped in a rolled-back txn)
# ---------------------------------------------------------------------------
@pytest.fixture
async def db(engine):
    """Yield a transactional session that rolls back after each test.

    This guarantees full test isolation without needing to truncate tables.
    """
    async with engine.connect() as conn:
        txn = await conn.begin()
        session = AsyncSession(bind=conn, expire_on_commit=False)
        try:
            yield session
        finally:
            await session.close()
            await txn.rollback()


# ---------------------------------------------------------------------------
# ASGI test client (function-scoped)
# ---------------------------------------------------------------------------
@pytest.fixture
async def client(db):
    """HTTP test client with the DB dependency overridden to use the test session."""

    async def _override():
        yield db

    app.dependency_overrides[get_db] = _override
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
    app.dependency_overrides.clear()
