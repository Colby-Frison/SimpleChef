from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.models.grocery import GroceryList, GroceryItem

router = APIRouter()

@router.get("/", response_model=schemas.GroceryList)
def read_grocery_list(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user's grocery list.
    """
    g_list = db.query(GroceryList).filter(GroceryList.user_id == current_user.id).first()
    if not g_list:
        g_list = GroceryList(user_id=current_user.id)
        db.add(g_list)
        db.commit()
        db.refresh(g_list)
    return g_list

@router.post("/items", response_model=schemas.GroceryItem)
def add_item(
    *,
    db: Session = Depends(deps.get_db),
    item_in: schemas.GroceryItemCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Add item to grocery list.
    """
    g_list = db.query(GroceryList).filter(GroceryList.user_id == current_user.id).first()
    if not g_list:
        g_list = GroceryList(user_id=current_user.id)
        db.add(g_list)
        db.commit()
        db.refresh(g_list)
    
    item = GroceryItem(**item_in.dict(), grocery_list_id=g_list.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/items/{id}", response_model=schemas.GroceryItem)
def update_item(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    item_in: schemas.GroceryItemUpdate,
) -> Any:
    """
    Update grocery item.
    """
    item = db.query(GroceryItem).filter(GroceryItem.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    update_data = item_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
