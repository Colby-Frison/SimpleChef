"""optional ingredient.step_id for mise en place

Revision ID: d4f6e3b2c1aa
Revises: c3e5d2f1a0bc
Create Date: 2026-02-03

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "d4f6e3b2c1aa"
down_revision: Union[str, Sequence[str], None] = "c3e5d2f1a0bc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("ingredient", sa.Column("step_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_ingredient_step_id_step",
        "ingredient",
        "step",
        ["step_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_ingredient_step_id_step", "ingredient", type_="foreignkey")
    op.drop_column("ingredient", "step_id")
