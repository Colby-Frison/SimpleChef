import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Searchbar, Chip, useTheme } from 'react-native-paper';
import { RecipeList } from '../../features/recipes/components/RecipeList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../theme/spacing';
import { useRecipeLibraryController } from '../../controllers';

const DIFFICULTIES = ['', 'Easy', 'Medium', 'Hard'] as const;

export default function HomeScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const library = useRecipeLibraryController({ searchQuery, difficulty });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="SimpleChef" />
      </Appbar.Header>
      <Searchbar
        placeholder="Search recipes"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
        accessibilityLabel="Search recipes"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        keyboardShouldPersistTaps="handled"
      >
        {DIFFICULTIES.map((d) => (
          <Chip
            key={d || 'all'}
            selected={difficulty === d}
            onPress={() => setDifficulty(d)}
            style={styles.filterChip}
            accessibilityLabel={d ? `Filter difficulty ${d}` : 'All difficulties'}
          >
            {d || 'All'}
          </Chip>
        ))}
      </ScrollView>
      <View style={styles.content}>
        <RecipeList
          recipes={library.recipes}
          loading={library.loading}
          onRefresh={library.refresh}
          debouncedSearch={library.debouncedSearch}
          hasActiveFilters={library.hasActiveFilters}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    marginRight: spacing.xs,
  },
  content: {
    flex: 1,
  },
});
