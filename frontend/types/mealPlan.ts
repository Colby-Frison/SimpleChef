/** Aligns with FastAPI `MealPlan` and `PlannerDaySummary`. */

export type MealPlanDto = {
  id: number;
  user_id: number;
  date: string;
  meal_type: string;
  recipe_id?: number | null;
  custom_food_name?: string | null;
  calories?: number | null;
  protein_grams?: number | null;
  carbs_grams?: number | null;
  fat_grams?: number | null;
  recipe_title?: string | null;
};

export type PlannerDaySummaryDto = {
  date: string;
  consumed_calories: number;
  meal_count: number;
  meals_with_calories_logged: number;
  meals_without_calories: number;
};
