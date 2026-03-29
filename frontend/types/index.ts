export type { RecipeDto, IngredientDto, StepDto } from './recipe';
export type { UserDto } from './user';
export type { MealPlanDto, PlannerDaySummaryDto } from './mealPlan';
export type { GroceryItemDto, GroceryListDto, GrocerySection } from './grocery';

/** Subset of `Recipe` for list cards. */
export type RecipeListItemDto = {
  id: number;
  title: string;
  image_url?: string | null;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  difficulty?: string | null;
  tags?: string[];
  total_calories?: number | null;
};
