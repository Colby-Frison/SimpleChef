from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Recipe])
def read_recipes(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve recipes.
    """
    recipes = crud.recipe.get_multi(db, skip=skip, limit=limit)
    return recipes

@router.post("/", response_model=schemas.Recipe)
def create_recipe(
    *,
    db: Session = Depends(deps.get_db),
    recipe_in: schemas.RecipeCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new recipe.
    """
    recipe = crud.recipe.create_with_owner(db=db, obj_in=recipe_in, owner_id=current_user.id)
    return recipe

from app.services.ai_service import ai_service

@router.post("/parse", response_model=schemas.RecipeCreate)
def parse_recipe(
    *,
    text: str,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Parse recipe from text using AI (Mock).
    """
    return ai_service.parse_text(text)

@router.get("/{id}", response_model=schemas.Recipe)
def read_recipe(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get recipe by ID.
    """
    recipe = crud.recipe.get(db=db, id=id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe
