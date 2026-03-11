"""
Clear all users from the database. Run from backend directory:
  cd backend
  python scripts/clear_users.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from sqlalchemy import text

def main():
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM user_friends"))
        db.execute(text("DELETE FROM groceryitem"))
        db.execute(text("DELETE FROM grocerylist"))
        db.execute(text("DELETE FROM mealplan"))
        db.execute(text("UPDATE recipe SET created_by_id = NULL"))
        db.execute(text("DELETE FROM \"user\""))
        db.commit()
        print("All users cleared.")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
