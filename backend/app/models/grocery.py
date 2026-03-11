from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class GroceryList(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), unique=True, nullable=False)
    
    items = relationship("GroceryItem", back_populates="grocery_list", cascade="all, delete-orphan")

class GroceryItem(Base):
    id = Column(Integer, primary_key=True, index=True)
    grocery_list_id = Column(Integer, ForeignKey("grocerylist.id"), nullable=False)
    
    name = Column(String, nullable=False)
    quantity = Column(Float, nullable=True)
    unit = Column(String, nullable=True)
    category = Column(String, default="Uncategorized")
    is_checked = Column(Boolean, default=False)
    
    grocery_list = relationship("GroceryList", back_populates="items")
