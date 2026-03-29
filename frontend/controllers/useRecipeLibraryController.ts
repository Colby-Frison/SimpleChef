import { useCallback, useEffect, useState } from 'react';
import { recipeService } from '../services/api';
import type { RecipeListItemDto } from '../types';

type Options = {
  searchQuery: string;
  difficulty: string;
  maxTotalMinutes?: number;
  tagsAll?: string;
};

export function useRecipeLibraryController({
  searchQuery,
  difficulty,
  maxTotalMinutes,
  tagsAll,
}: Options) {
  const [recipes, setRecipes] = useState<RecipeListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [debouncedQ, setDebouncedQ] = useState('');

  useEffect(() => {
    if (searchQuery === '') {
      setDebouncedQ('');
      return;
    }
    const t = setTimeout(() => setDebouncedQ(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await recipeService.getAll({
        q: debouncedQ.trim() || undefined,
        difficulty: difficulty.trim() || undefined,
        max_total_minutes: maxTotalMinutes,
        tags_all: tagsAll?.trim() || undefined,
      });
      setRecipes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, difficulty, maxTotalMinutes, tagsAll]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const hasActiveFilters = Boolean(
    debouncedQ.trim() || difficulty.trim() || maxTotalMinutes != null || tagsAll?.trim()
  );

  return {
    recipes,
    loading,
    refresh: loadRecipes,
    debouncedSearch: debouncedQ,
    hasActiveFilters,
  };
}
