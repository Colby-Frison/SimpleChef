from typing import List, Optional
from pydantic import BaseModel

# Ingredient Schemas
class IngredientBase(BaseModel):
    name: str
    quantity: Optional[float] = None
    unit: Optional[str] = None

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    recipe_id: int

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

class RecipeCreate(RecipeBase):
    ingredients: List[IngredientCreate] = []
    steps: List[StepCreate] = []

class RecipeUpdate(RecipeBase):
    ingredients: Optional[List[IngredientCreate]] = None
    steps: Optional[List[StepCreate]] = None

class Recipe(RecipeBase):
    id: int
    created_by_id: Optional[int]
    ingredients: List[Ingredient] = []
    steps: List[Step] = []

    class Config:
        from_attributes = True
