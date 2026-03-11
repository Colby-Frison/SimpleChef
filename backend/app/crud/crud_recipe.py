from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from app.models.recipe import Recipe, Ingredient, Step
from app.schemas.recipe import RecipeCreate, RecipeUpdate

class CRUDRecipe:
    def get(self, db: Session, id: int) -> Optional[Recipe]:
        return db.query(Recipe).filter(Recipe.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[Recipe]:
        return db.query(Recipe).offset(skip).limit(limit).all()

    def create_with_owner(
        self, db: Session, *, obj_in: RecipeCreate, owner_id: int
    ) -> Recipe:
        obj_in_data = jsonable_encoder(obj_in)
        ingredients_data = obj_in_data.pop("ingredients", [])
        steps_data = obj_in_data.pop("steps", [])
        
        db_obj = Recipe(**obj_in_data, created_by_id=owner_id)
        db.add(db_obj)
        db.commit() # Commit to get ID
        db.refresh(db_obj)

        for ingredient in ingredients_data:
            db_ingredient = Ingredient(**ingredient, recipe_id=db_obj.id)
            db.add(db_ingredient)
        
        for step in steps_data:
            db_step = Step(**step, recipe_id=db_obj.id)
            db.add(db_step)
            
        db.commit()
        db.refresh(db_obj)
        return db_obj

recipe = CRUDRecipe()
