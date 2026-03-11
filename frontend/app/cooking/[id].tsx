import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Checkbox, IconButton, Appbar, ProgressBar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recipeService } from '../../services/api';
import { useTimerStore } from '../../store/useTimerStore';
import { TimerDock } from '../../features/cooking/components/TimerDock';

export default function CookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  
  const { addTimer, tick } = useTimerStore();

  useEffect(() => {
    loadRecipe();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadRecipe = async () => {
    try {
      const data = await recipeService.getById(Number(id));
      setRecipe(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!recipe) return <View><Text>Loading...</Text></View>;

  const steps = recipe.steps || [];
  const currentStep = steps[currentStepIndex];
  
  // Basic heuristic: show all ingredients for now, or filter if we had mapping.
  // The plan said "Ingredients for this step". 
  // Since our data model doesn't explicitly link ingredients to steps yet (complex),
  // we will just show the "Mise en Place" as a general checklist or empty for now if not linked.
  // I'll show all ingredients but maybe we can just show a "Notes" section or nothing.
  // Let's show all ingredients for the user to check off as they go? No, that's overwhelming.
  // I'll just show a placeholder text for "Mise en Place" if no data, or show ingredients that match text?
  // Let's just list all ingredients in a collapsible view or skip it for this MVP iteration if data missing.
  // I'll skip specific mise-en-place filtering and just show the step.

  const isLastStep = currentStepIndex === steps.length - 1;

  const nextStep = () => {
    if (!isLastStep) setCurrentStepIndex(currentStepIndex + 1);
    else {
        // Finish
        router.back();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleStartTimer = () => {
      if (currentStep.timer_seconds) {
          addTimer(`Step ${currentStep.order_index}`, currentStep.timer_seconds);
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`Step ${currentStepIndex + 1} of ${steps.length}`} />
      </Appbar.Header>
      
      <ProgressBar progress={(currentStepIndex + 1) / steps.length} />

      <TimerDock />

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.stepTitle}>
            Step {currentStep.order_index}
        </Text>
        
        <Text variant="bodyLarge" style={styles.instruction}>
            {currentStep.instruction}
        </Text>

        {currentStep.timer_seconds && (
            <Button 
                mode="contained" 
                icon="timer" 
                onPress={handleStartTimer} 
                style={styles.timerButton}
            >
                Start {currentStep.timer_seconds / 60} min Timer
            </Button>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <Button mode="outlined" onPress={prevStep} disabled={currentStepIndex === 0}>
            Previous
        </Button>
        <Button mode="contained" onPress={nextStep}>
            {isLastStep ? "Finish Cooking" : "Next Step"}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  stepTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instruction: {
    lineHeight: 24,
    marginBottom: 24,
  },
  timerButton: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
});
