import pytest
from fastapi import HTTPException

from app.schemas.recipe import IngredientCreate, RecipeCreate, StepCreate
from app.services.recipe_parse_validation import reject_if_url_only, validate_parsed_recipe


def test_validate_parsed_recipe_ok():
    r = RecipeCreate(
        title="Soup",
        ingredients=[IngredientCreate(name="water")],
        steps=[StepCreate(order_index=1, instruction="Boil.")],
    )
    validate_parsed_recipe(r)


def test_validate_empty_title():
    r = RecipeCreate(
        title="   ",
        ingredients=[IngredientCreate(name="x")],
        steps=[StepCreate(order_index=1, instruction="y")],
    )
    with pytest.raises(HTTPException) as e:
        validate_parsed_recipe(r)
    assert e.value.status_code == 422


def test_reject_url_paste():
    with pytest.raises(HTTPException) as e:
        reject_if_url_only("https://example.com/recipe")
    assert e.value.status_code == 400
