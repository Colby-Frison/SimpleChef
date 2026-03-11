from typing import List, Optional
from pydantic import BaseModel

class GroceryItemBase(BaseModel):
    name: str
    quantity: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = "Uncategorized"
    is_checked: bool = False

class GroceryItemCreate(GroceryItemBase):
    pass

class GroceryItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    is_checked: Optional[bool] = None

class GroceryItem(GroceryItemBase):
    id: int
    grocery_list_id: int

    class Config:
        from_attributes = True

class GroceryList(BaseModel):
    id: int
    items: List[GroceryItem] = []

    class Config:
        from_attributes = True
