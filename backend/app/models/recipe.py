from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Recipe(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    
    prep_time_minutes = Column(Integer, default=0)
    cook_time_minutes = Column(Integer, default=0)
    servings = Column(Integer, default=1)
    difficulty = Column(String, default="Medium") # Easy, Medium, Hard
    
    total_calories = Column(Integer, nullable=True)
    protein_grams = Column(Integer, nullable=True)
    carbs_grams = Column(Integer, nullable=True)
    fat_grams = Column(Integer, nullable=True)
    created_by_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    is_public = Column(Boolean, default=False, nullable=False)
    tags = Column(JSONB, nullable=False, default=list, server_default="[]")

    ingredients = relationship("Ingredient", back_populates="recipe", cascade="all, delete-orphan")
    steps = relationship("Step", back_populates="recipe", cascade="all, delete-orphan")

class Ingredient(Base):
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipe.id"))
    step_id = Column(Integer, ForeignKey("step.id"), nullable=True)
    name = Column(String, nullable=False)
    quantity = Column(Float, nullable=True)
    unit = Column(String, nullable=True)

    recipe = relationship("Recipe", back_populates="ingredients")
    step = relationship("Step", back_populates="ingredients")

class Step(Base):
    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey("recipe.id"))
    order_index = Column(Integer, nullable=False)
    instruction = Column(Text, nullable=False)
    timer_seconds = Column(Integer, nullable=True)

    recipe = relationship("Recipe", back_populates="steps")
    ingredients = relationship("Ingredient", back_populates="step")
