"""add recipe is_public

Revision ID: b2f4a1c8e9ab
Revises: 9d1c3a9449d9
Create Date: 2026-02-03

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b2f4a1c8e9ab"
down_revision: Union[str, Sequence[str], None] = "9d1c3a9449d9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "recipe",
        sa.Column(
            "is_public",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    # Legacy rows with no owner remain discoverable as public demo data
    op.execute(
        "UPDATE recipe SET is_public = true WHERE created_by_id IS NULL"
    )
    op.alter_column("recipe", "is_public", server_default=None)


def downgrade() -> None:
    op.drop_column("recipe", "is_public")
