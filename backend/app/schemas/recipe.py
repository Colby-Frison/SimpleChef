from typing import List, Optional
from pydantic import BaseModel, Field

# Ingredient Schemas
class IngredientBase(BaseModel):
    name: str
    quantity: Optional[float] = None
    unit: Optional[str] = None

class IngredientCreate(IngredientBase):
    """When creating/updating, link to a step by 1-based order_index (matches Step.order_index)."""
    step_order_index: Optional[int] = None


class Ingredient(IngredientBase):
    id: int
    recipe_id: int
    step_id: Optional[int] = None

    class Config:
        from_attributes = True

# Step Schemas
class StepBase(BaseModel):
    order_index: int
    instruction: str
    timer_seconds: Optional[int] = None

class StepCreate(StepBase):
    pass

class Step(StepBase):
    id: int
    recipe_id: int

    class Config:
        from_attributes = True

# Recipe Schemas
class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    prep_time_minutes: Optional[int] = 0
    cook_time_minutes: Optional[int] = 0
    servings: Optional[int] = 1
    difficulty: Optional[str] = "Medium"
    total_calories: Optional[int] = None
    is_public: Optional[bool] = False
    tags: List[str] = Field(default_factory=list)

class RecipeCreate(RecipeBase):
    ingredients: List[IngredientCreate] = []
    steps: List[StepCreate] = []

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    servings: Optional[int] = None
    difficulty: Optional[str] = None
    total_calories: Optional[int] = None
    is_public: Optional[bool] = None
    tags: Optional[List[str]] = None
    ingredients: Optional[List[IngredientCreate]] = None
    steps: Optional[List[StepCreate]] = None

class Recipe(RecipeBase):
    id: int
    created_by_id: Optional[int] = None
    ingredients: List[Ingredient] = []
    steps: List[Step] = []

    class Config:
        from_attributes = True
