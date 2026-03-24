"""add recipe tags json

Revision ID: c3e5d2f1a0bc
Revises: b2f4a1c8e9ab
Create Date: 2026-02-03

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "c3e5d2f1a0bc"
down_revision: Union[str, Sequence[str], None] = "b2f4a1c8e9ab"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "recipe",
        sa.Column(
            "tags",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
    )
    op.alter_column("recipe", "tags", server_default=None)


def downgrade() -> None:
    op.drop_column("recipe", "tags")
