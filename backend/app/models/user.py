from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

user_friends = Table(
    'user_friends',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('user.id'), primary_key=True),
    Column('friend_id', Integer, ForeignKey('user.id'), primary_key=True)
)

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    
    # Preferences & Goals
    calorie_goal = Column(Integer, default=2000)
    dietary_restrictions = Column(JSON, default=list) # List of strings e.g. ["Vegetarian", "GF"]
    is_screen_always_on = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    friends = relationship(
        "User",
        secondary=user_friends,
        primaryjoin=id==user_friends.c.user_id,
        secondaryjoin=id==user_friends.c.friend_id,
        backref="friended_by"
    )
