from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class MealType(str, enum.Enum):
    BREAKFAST = "Breakfast"
    LUNCH = "Lunch"
    DINNER = "Dinner"
    SNACK = "Snack"

class MealPlan(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    
    recipe_id = Column(Integer, ForeignKey("recipe.id"), nullable=True)
    
    # For quick add without recipe
    custom_food_name = Column(String, nullable=True)
    calories = Column(Integer, nullable=True)
    
    meal_type = Column(String, default=MealType.DINNER) # Simple string or Enum
    
    recipe = relationship("Recipe")
