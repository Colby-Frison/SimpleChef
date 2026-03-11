from fastapi import APIRouter
from app.api.api_v1.endpoints import login, users, recipes, planner, grocery

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
api_router.include_router(planner.router, prefix="/planner", tags=["planner"])
api_router.include_router(grocery.router, prefix="/grocery", tags=["grocery"])
