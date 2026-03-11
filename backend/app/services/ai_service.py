from app.schemas.recipe import RecipeCreate, IngredientCreate, StepCreate

class AIService:
    def parse_text(self, text: str) -> RecipeCreate:
        """
        Mock implementation of AI parsing.
        In a real app, this would call OpenAI/LangChain.
        """
        # Simple heuristic or just return a dummy recipe based on text length
        return RecipeCreate(
            title="AI Generated Recipe",
            description="Parsed from text: " + text[:50] + "...",
            ingredients=[
                IngredientCreate(name="Tomato", quantity=2, unit="pcs"),
                IngredientCreate(name="Salt", quantity=1, unit="tsp")
            ],
            steps=[
                StepCreate(order_index=1, instruction="Chop tomatoes.", timer_seconds=60),
                StepCreate(order_index=2, instruction="Add salt.", timer_seconds=None)
            ],
            prep_time_minutes=10,
            cook_time_minutes=20,
            servings=2
        )

ai_service = AIService()
