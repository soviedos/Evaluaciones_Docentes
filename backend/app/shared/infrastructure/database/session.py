"""Async database engine and session factory.

Connection lifecycle:
    1. Engine is created once at import time (module-level singleton).
    2. ``get_db()`` yields a session per request; commits on success,
       rolls back on exception, and always closes.
    3. Pool settings are tuned for a small-to-medium workload.
       Adjust ``pool_size`` / ``max_overflow`` via env vars for production.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.shared.core.config import settings

_is_sqlite = settings.database_url.startswith("sqlite")

_engine_kwargs: dict = {
    "echo": settings.db_echo,
}
if not _is_sqlite:
    _engine_kwargs.update(
        pool_pre_ping=True,
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
    )

engine = create_async_engine(settings.database_url, **_engine_kwargs)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield a transactional async session; commit or rollback automatically."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
