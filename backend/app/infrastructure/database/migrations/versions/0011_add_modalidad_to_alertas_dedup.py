"""add modalidad to alertas dedup constraint

Enforces [AL-10]: alert granularity = docente + curso + periodo +
tipo_alerta + modalidad.  The previous constraint omitted modalidad,
which could cause conflict if the same docente+curso+periodo appeared
under different modalities.

Revision ID: 0011
Revises: 0010
Create Date: 2026-04-11
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0011"
down_revision: str = "0010"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_constraint("uq_alertas_dedup", "alertas", type_="unique")
    op.create_unique_constraint(
        "uq_alertas_dedup",
        "alertas",
        ["docente_nombre", "curso", "periodo", "tipo_alerta", "modalidad"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_alertas_dedup", "alertas", type_="unique")
    op.create_unique_constraint(
        "uq_alertas_dedup",
        "alertas",
        ["docente_nombre", "curso", "periodo", "tipo_alerta"],
    )
