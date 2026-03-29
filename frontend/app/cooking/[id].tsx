import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Appbar,
  ProgressBar,
  Checkbox,
  Portal,
  Modal,
  List,
  useTheme,
} from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import { TimerDock } from '../../features/cooking/components/TimerDock';
import { spacing } from '../../theme/spacing';
import { useCookingController } from '../../controllers';

function KeepScreenOn() {
  useKeepAwake();
  return null;
}

export default function CookingScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useCookingController(id);

  if (c.loading || !c.recipe) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => c.router.back()} />
          <Appbar.Content title="Cooking" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { recipe, steps, ingredients, currentStep, currentStepIndex, miseItems } = c;

  if (steps.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => c.router.back()} />
          <Appbar.Content title={recipe.title || 'Recipe'} subtitle="No steps" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            This recipe has no steps yet. Add steps in the recipe editor, then try again.
          </Text>
          <Button mode="contained" onPress={() => c.router.back()} style={styles.emptyButton}>
            Go back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {c.keepAwakePref ? <KeepScreenOn /> : null}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => c.router.back()} />
        <Appbar.Content
          title={`Step ${currentStepIndex + 1} of ${steps.length}`}
          subtitle={recipe.title}
        />
        <Appbar.Action icon="format-list-bulleted" onPress={() => c.setAllIngOpen(true)} accessibilityLabel="View all ingredients" />
      </Appbar.Header>

      <ProgressBar progress={(currentStepIndex + 1) / steps.length} />

      <TimerDock />

      <ScrollView contentContainerStyle={styles.content}>
        {miseItems.length > 0 ? (
          <View style={[styles.mise, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="titleMedium" style={styles.miseTitle}>
              Mise en place
            </Text>
            {miseItems.map((ing) => (
              <View key={ing.id} style={styles.miseRow}>
                <Checkbox
                  status={c.checked[ing.id] ? 'checked' : 'unchecked'}
                  onPress={() => c.toggleIng(ing.id)}
                />
                <Text variant="bodyLarge" style={styles.miseText}>
                  {ing.name}
                  {ing.quantity != null ? ` — ${ing.quantity} ${ing.unit || ''}` : ''}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text variant="headlineSmall" style={styles.stepTitle}>
          Step {currentStep!.order_index}
        </Text>

        <Text variant="bodyLarge" style={styles.instruction}>
          {currentStep!.instruction}
        </Text>

        {currentStep!.timer_seconds ? (
          <Button mode="contained" icon="timer" onPress={c.handleStartTimer} style={styles.timerButton}>
            Start {currentStep!.timer_seconds / 60} min timer
          </Button>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.colors.outline }]}>
        <Button mode="outlined" onPress={c.prevStep} disabled={currentStepIndex === 0}>
          Previous
        </Button>
        <Button mode="contained" onPress={c.nextStep}>
          {c.isLastStep ? 'Finish cooking' : 'Next step'}
        </Button>
      </View>

      <Portal>
        <Modal
          visible={c.allIngOpen}
          onDismiss={() => c.setAllIngOpen(false)}
          contentContainerStyle={[styles.allModal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            All ingredients
          </Text>
          <ScrollView style={styles.modalScroll}>
            {ingredients.map((ing) => (
              <List.Item
                key={ing.id}
                title={ing.name}
                description={`${ing.quantity ?? ''} ${ing.unit ?? ''}`.trim()}
              />
            ))}
          </ScrollView>
          <Button mode="contained" onPress={() => c.setAllIngOpen(false)}>
            Close
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    alignSelf: 'center',
  },
  content: {
    padding: spacing.xl,
    flexGrow: 1,
  },
  mise: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
  },
  miseTitle: {
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  miseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  miseText: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  instruction: {
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  timerButton: {
    marginTop: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  allModal: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: spacing.sm,
  },
  modalScroll: {
    maxHeight: 360,
    marginBottom: spacing.md,
  },
});
