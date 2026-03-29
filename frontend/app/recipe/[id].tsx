import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import {
  Text,
  Button,
  ActivityIndicator,
  List,
  Divider,
  useTheme,
  Portal,
  Modal,
  TextInput,
  Dialog,
  Chip,
} from 'react-native-paper';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../theme/spacing';
import { useRecipeDetailController, RECIPE_DETAIL_MEAL_TYPES } from '../../controllers';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useRecipeDetailController(id);
  const theme = useTheme();

  if (c.loading) {
    return <ActivityIndicator style={styles.loading} size="large" />;
  }

  if (!c.recipe) {
    return <Text style={styles.missing}>Recipe not found</Text>;
  }

  const recipe = c.recipe;
  const prep = recipe.prep_time_minutes ?? 0;
  const cook = recipe.cook_time_minutes ?? 0;
  const servings = recipe.servings ?? 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: recipe.title, headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {recipe.image_url ? (
          <Image source={{ uri: recipe.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.heroPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Recipe
            </Text>
          </View>
        )}

        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            {recipe.title}
          </Text>
          <View style={styles.strip}>
            <Text variant="bodyMedium">
              Prep {prep} min · Cook {cook} min · Total {prep + cook} min
            </Text>
            <Text variant="bodyMedium">Servings {servings}</Text>
            <Text variant="bodyMedium">Difficulty {recipe.difficulty}</Text>
            {recipe.total_calories != null ? (
              <Text variant="bodyMedium">About {recipe.total_calories} kcal (total)</Text>
            ) : null}
          </View>
        </View>

        {recipe.description ? (
          <Text variant="bodyMedium" style={styles.description}>
            {recipe.description}
          </Text>
        ) : null}

        <Divider />

        <List.Accordion
          title="Ingredients"
          expanded={c.ingredientsOpen}
          onPress={() => c.setIngredientsOpen(!c.ingredientsOpen)}
        >
          {(recipe.ingredients || []).map((ing) => (
            <List.Item
              key={ing.id}
              title={ing.name}
              description={`${ing.quantity ?? ''} ${ing.unit ?? ''}`.trim()}
              left={(props) => <List.Icon {...props} icon="circle-outline" />}
            />
          ))}
        </List.Accordion>

        <Divider />

        <List.Section>
          <List.Subheader>Instructions</List.Subheader>
          {(recipe.steps || []).map((step) => (
            <List.Item
              key={step.id}
              title={`Step ${step.order_index}`}
              description={step.instruction}
              descriptionNumberOfLines={20}
            />
          ))}
        </List.Section>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => c.router.push(`/cooking/${recipe.id}`)}
            style={styles.button}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Begin cooking"
          >
            Begin cooking
          </Button>
          <Button mode="outlined" onPress={() => c.setPlanOpen(true)} style={styles.button}>
            Add to calendar
          </Button>
          {c.isOwner ? (
            <>
              <Button
                mode="outlined"
                onPress={() =>
                  c.router.push({
                    pathname: '/add/manual',
                    params: { editId: String(recipe.id) },
                  })
                }
                style={styles.button}
              >
                Edit recipe
              </Button>
              <Button mode="text" textColor={theme.colors.error} onPress={() => c.setDeleteOpen(true)}>
                Delete recipe
              </Button>
            </>
          ) : null}
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={c.planOpen}
          onDismiss={() => c.setPlanOpen(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleLarge">Add to calendar</Text>
          <TextInput
            label="Date (YYYY-MM-DD)"
            value={c.planDate}
            onChangeText={c.setPlanDate}
            mode="outlined"
          />
          <Text variant="labelLarge">Meal type</Text>
          <View style={styles.mealChips}>
            {RECIPE_DETAIL_MEAL_TYPES.map((m) => (
              <Chip key={m} selected={c.mealType === m} onPress={() => c.setMealType(m)}>
                {m}
              </Chip>
            ))}
          </View>
          <View style={styles.modalActions}>
            <Button onPress={() => c.setPlanOpen(false)}>Cancel</Button>
            <Button mode="contained" loading={c.planSaving} onPress={c.addToCalendar}>
              Save
            </Button>
          </View>
        </Modal>

        <Dialog visible={c.deleteOpen} onDismiss={() => c.setDeleteOpen(false)}>
          <Dialog.Title>Delete recipe?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">This cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => c.setDeleteOpen(false)}>Cancel</Button>
            <Button loading={c.deleting} textColor={theme.colors.error} onPress={c.handleDelete}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  missing: {
    padding: spacing.xl,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  image: {
    width: '100%',
    height: 200,
  },
  heroPlaceholder: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  strip: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  description: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  actions: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    minHeight: 48,
  },
  modal: {
    padding: spacing.xl,
    margin: spacing.lg,
    borderRadius: 8,
    gap: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  mealChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
