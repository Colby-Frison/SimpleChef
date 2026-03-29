import React from 'react';
import { FlatList, View, StyleSheet, useWindowDimensions } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RecipeCard } from './RecipeCard';
import { spacing } from '../../../theme/spacing';
import type { RecipeListItemDto } from '../../../types';

export type RecipeListProps = {
  recipes: RecipeListItemDto[];
  loading: boolean;
  onRefresh: () => void;
  debouncedSearch: string;
  hasActiveFilters: boolean;
};

export const RecipeList = ({
  recipes,
  loading,
  onRefresh,
  debouncedSearch,
  hasActiveFilters,
}: RecipeListProps) => {
  const router = useRouter();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const numColumns = width >= 720 ? 2 : 1;

  if (loading && recipes.length === 0) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  return (
    <FlatList
      data={recipes}
      key={numColumns}
      numColumns={numColumns}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={numColumns > 1 ? styles.columnWrap : undefined}
      refreshing={loading}
      onRefresh={onRefresh}
      renderItem={({ item }) => (
        <View style={numColumns > 1 ? styles.gridCell : styles.fullWidth}>
          <RecipeCard
            id={item.id}
            title={item.title}
            image={item.image_url ?? undefined}
            totalTimeMinutes={(item.prep_time_minutes || 0) + (item.cook_time_minutes || 0)}
            difficulty={item.difficulty ?? '—'}
            tags={item.tags}
            calories={item.total_calories}
            compact={numColumns > 1}
            onPress={() => router.push(`/recipe/${item.id}`)}
          />
        </View>
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={[styles.empty, { color: theme.colors.onSurfaceVariant }]}>
          {hasActiveFilters
            ? 'No recipes match your filters.'
            : 'No recipes found. Add one!'}
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  columnWrap: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  gridCell: {
    flex: 1,
    maxWidth: '50%',
    paddingHorizontal: spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
});
