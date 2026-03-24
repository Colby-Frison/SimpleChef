"""Server-side validation for AI/demo parse output before returning RecipeCreate."""

from fastapi import HTTPException, status

from app.schemas.recipe import RecipeCreate


def validate_parsed_recipe(recipe: RecipeCreate) -> None:
    """Ensure parse output is safe to save as a draft (title, steps, ingredient shape)."""
    title = (recipe.title or "").strip()
    if not title:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Parsed recipe must include a non-empty title",
        )
    if not recipe.steps or len(recipe.steps) < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Parsed recipe must include at least one step",
        )
    for i, step in enumerate(recipe.steps):
        if not (step.instruction or "").strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Step {i + 1} must have a non-empty instruction",
            )
    for i, ing in enumerate(recipe.ingredients):
        if not (ing.name or "").strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Ingredient {i + 1} must have a name",
            )


def reject_if_url_only(text: str) -> None:
    """We do not fetch remote URLs; reject obvious URL pastes with a clear error."""
    s = text.strip()
    if not s:
        return
    lower = s.lower()
    if lower.startswith("http://") or lower.startswith("https://"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URL import is not supported. Paste the recipe text only.",
        )
