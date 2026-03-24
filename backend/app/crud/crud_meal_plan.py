from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.meal_plan import MealPlan
from app.schemas.meal_plan import MealPlanCreate, MealPlanUpdate


class CRUDMealPlan:
    def get_by_date_range(self, db: Session, user_id: int, start_date: str, end_date: str) -> List[MealPlan]:
        return db.query(MealPlan).filter(
            MealPlan.user_id == user_id,
            MealPlan.date >= start_date,
            MealPlan.date <= end_date
        ).all()

    def get_owned(self, db: Session, *, meal_id: int, user_id: int) -> Optional[MealPlan]:
        return (
            db.query(MealPlan)
            .filter(MealPlan.id == meal_id, MealPlan.user_id == user_id)
            .first()
        )

    def create(self, db: Session, *, obj_in: MealPlanCreate, user_id: int) -> MealPlan:
        db_obj = MealPlan(
            **obj_in.model_dump(),
            user_id=user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: MealPlan, obj_in: MealPlanUpdate
    ) -> MealPlan:
        for k, v in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, k, v)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, meal_id: int) -> None:
        db.query(MealPlan).filter(MealPlan.id == meal_id).delete()
        db.commit()

meal_plan = CRUDMealPlan()
