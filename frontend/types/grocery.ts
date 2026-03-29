/** Aligns with FastAPI grocery responses. */

export type GroceryItemDto = {
  id: number;
  grocery_list_id: number;
  name: string;
  quantity?: number | null;
  unit?: string | null;
  category?: string | null;
  is_checked: boolean;
};

export type GroceryListDto = {
  id: number;
  items: GroceryItemDto[];
};

export type GrocerySection = {
  title: string;
  data: GroceryItemDto[];
};
