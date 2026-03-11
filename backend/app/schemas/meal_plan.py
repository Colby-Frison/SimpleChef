from typing import Optional
from pydantic import BaseModel
from datetime import date

class MealPlanBase(BaseModel):
    date: date
    meal_type: str = "Dinner"
    recipe_id: Optional[int] = None
    custom_food_name: Optional[str] = None
    calories: Optional[int] = None

class MealPlanCreate(MealPlanBase):
    pass

class MealPlanUpdate(MealPlanBase):
    pass

class MealPlan(MealPlanBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
