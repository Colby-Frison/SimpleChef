from typing import Any, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.MealPlan])
def read_meal_plans(
    start_date: date,
    end_date: date,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get meal plans for a date range.
    """
    plans = crud.meal_plan.get_by_date_range(
        db, user_id=current_user.id, start_date=start_date, end_date=end_date
    )
    return plans

@router.post("/", response_model=schemas.MealPlan)
def create_meal_plan(
    *,
    db: Session = Depends(deps.get_db),
    meal_plan_in: schemas.MealPlanCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Add a meal to the plan.
    """
    meal_plan = crud.meal_plan.create(db=db, obj_in=meal_plan_in, user_id=current_user.id)
    return meal_plan
