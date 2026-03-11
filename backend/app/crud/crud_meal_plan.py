from typing import List
from sqlalchemy.orm import Session
from app.models.meal_plan import MealPlan
from app.schemas.meal_plan import MealPlanCreate

class CRUDMealPlan:
    def get_by_date_range(self, db: Session, user_id: int, start_date: str, end_date: str) -> List[MealPlan]:
        return db.query(MealPlan).filter(
            MealPlan.user_id == user_id,
            MealPlan.date >= start_date,
            MealPlan.date <= end_date
        ).all()

    def create(self, db: Session, *, obj_in: MealPlanCreate, user_id: int) -> MealPlan:
        db_obj = MealPlan(
            **obj_in.dict(),
            user_id=user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

meal_plan = CRUDMealPlan()
