"""add optional recipe macro nutrients

Revision ID: e8a9b7c6d5f4
Revises: d4f6e3b2c1aa
Create Date: 2026-04-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e8a9b7c6d5f4"
down_revision: Union[str, Sequence[str], None] = "d4f6e3b2c1aa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("recipe", sa.Column("protein_grams", sa.Integer(), nullable=True))
    op.add_column("recipe", sa.Column("carbs_grams", sa.Integer(), nullable=True))
    op.add_column("recipe", sa.Column("fat_grams", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("recipe", "fat_grams")
    op.drop_column("recipe", "carbs_grams")
    op.drop_column("recipe", "protein_grams")
