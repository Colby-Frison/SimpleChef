import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { RecipeCard } from './RecipeCard';
import { recipeService } from '../../../services/api';
import { useRouter } from 'expo-router';

export const RecipeList = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <RecipeCard
          id={item.id}
          title={item.title}
          image={item.image_url}
          prepTime={item.prep_time_minutes}
          difficulty={item.difficulty}
          onPress={() => router.push(`/recipe/${item.id}`)}
        />
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No recipes found. Add one!</Text>}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  }
});
