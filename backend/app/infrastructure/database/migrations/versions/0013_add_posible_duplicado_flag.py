"""add posible_duplicado flag to documentos

Adds a boolean flag ``posible_duplicado`` (default ``false``) to the
``documentos`` table.  Set to ``true`` by the duplicate detection
service when at least one probable-duplicate finding is created.

This flag allows the UI to quickly filter/display documents that
have been flagged without joining the ``duplicados_probables`` table.

Revision ID: 0013
Revises: 0012
Create Date: 2026-04-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0013"
down_revision: str = "0012"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "documentos",
        sa.Column(
            "posible_duplicado",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )


def downgrade() -> None:
    op.drop_column("documentos", "posible_duplicado")
