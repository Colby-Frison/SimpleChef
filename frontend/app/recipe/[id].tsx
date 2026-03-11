import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Button, ActivityIndicator, List, Divider, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { recipeService } from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (id) {
      loadRecipe(Number(id));
    }
  }, [id]);

  const loadRecipe = async (recipeId: number) => {
    try {
      const data = await recipeService.getById(recipeId);
      setRecipe(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  if (!recipe) {
    return <Text>Recipe not found</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: recipe.title, headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {recipe.image_url && (
          <Image source={{ uri: recipe.image_url }} style={styles.image} />
        )}
        
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>{recipe.title}</Text>
          <View style={styles.statsRow}>
            <Text variant="bodyMedium">🕒 {recipe.prep_time_minutes + recipe.cook_time_minutes} min</Text>
            <Text variant="bodyMedium">🔥 {recipe.difficulty}</Text>
            <Text variant="bodyMedium">🥘 {recipe.servings} servings</Text>
          </View>
        </View>

        <Divider />

        <List.Section>
          <List.Subheader>Ingredients</List.Subheader>
          {recipe.ingredients.map((ing: any) => (
            <List.Item
              key={ing.id}
              title={ing.name}
              description={`${ing.quantity || ''} ${ing.unit || ''}`}
              left={props => <List.Icon {...props} icon="food-apple" />}
            />
          ))}
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Instructions</List.Subheader>
          {recipe.steps.map((step: any) => (
            <List.Item
              key={step.id}
              title={`Step ${step.order_index}`}
              description={step.instruction}
              descriptionNumberOfLines={10}
            />
          ))}
        </List.Section>

        <View style={styles.footer}>
          <Button 
            mode="contained" 
            onPress={() => router.push(`/cooking/${recipe.id}`)}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            BEGIN COOKING
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  image: {
    width: '100%',
    height: 200,
  },
  header: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footer: {
    padding: 16,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  }
});
