"""add optional macro grams on meal_plan

Revision ID: a1b2c3d4e5f6
Revises: e8a9b7c6d5f4
Create Date: 2026-04-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "e8a9b7c6d5f4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("mealplan", sa.Column("protein_grams", sa.Integer(), nullable=True))
    op.add_column("mealplan", sa.Column("carbs_grams", sa.Integer(), nullable=True))
    op.add_column("mealplan", sa.Column("fat_grams", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("mealplan", "fat_grams")
    op.drop_column("mealplan", "carbs_grams")
    op.drop_column("mealplan", "protein_grams")
