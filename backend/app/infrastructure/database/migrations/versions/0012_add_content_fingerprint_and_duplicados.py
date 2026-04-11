"""add content_fingerprint and duplicados_probables table

Adds probabilistic duplicate detection infrastructure:

1. ``documentos.content_fingerprint`` — a SHA-256 hash of the logical
   signature (docente + periodo + modalidad + cursos + puntaje), computed
   after successful parsing.  Two PDFs with different bytes but identical
   logical content will share the same fingerprint.

2. ``duplicados_probables`` — records each probable-duplicate finding
   between two documents.  Non-blocking: both documents remain fully
   usable.  A human reviewer can confirm or discard the finding.

Revision ID: 0012
Revises: 0011
Create Date: 2026-04-11
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0012"
down_revision: str = "0011"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # ── 1. Add content_fingerprint to documentos ────────────────────
    op.add_column(
        "documentos",
        sa.Column("content_fingerprint", sa.String(64), nullable=True),
    )
    op.create_index(
        "ix_documentos_content_fingerprint",
        "documentos",
        ["content_fingerprint"],
    )

    # ── 2. Create duplicados_probables table ────────────────────────
    op.create_table(
        "duplicados_probables",
        sa.Column("id", sa.Uuid, primary_key=True, default=sa.text("gen_random_uuid()")),
        sa.Column(
            "documento_id",
            sa.Uuid,
            sa.ForeignKey("documentos.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column(
            "documento_coincidente_id",
            sa.Uuid,
            sa.ForeignKey("documentos.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
        sa.Column("fingerprint", sa.String(64), nullable=False),
        sa.Column("score", sa.Numeric(3, 2), nullable=False, server_default="1.0"),
        sa.Column("criterios", sa.dialects.postgresql.JSONB, nullable=False),
        sa.Column(
            "estado",
            sa.String(20),
            nullable=False,
            server_default="pendiente",
        ),
        sa.Column("notas", sa.Text, nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        # ── Constraints ─────────────────────────────────────────────
        sa.UniqueConstraint(
            "documento_id",
            "documento_coincidente_id",
            name="uq_duplicados_par",
        ),
        sa.CheckConstraint(
            "documento_id != documento_coincidente_id",
            name="ck_duplicados_no_self",
        ),
        sa.CheckConstraint(
            "estado IN ('pendiente', 'confirmado', 'descartado')",
            name="ck_duplicados_estado",
        ),
        sa.CheckConstraint(
            "score >= 0.0 AND score <= 1.0",
            name="ck_duplicados_score_rango",
        ),
    )

    # Partial index for efficient "pending review" queries
    op.create_index(
        "ix_duplicados_estado_pendiente",
        "duplicados_probables",
        ["estado"],
        postgresql_where=sa.text("estado = 'pendiente'"),
    )


def downgrade() -> None:
    op.drop_index("ix_duplicados_estado_pendiente", table_name="duplicados_probables")
    op.drop_table("duplicados_probables")
    op.drop_index("ix_documentos_content_fingerprint", table_name="documentos")
    op.drop_column("documentos", "content_fingerprint")
