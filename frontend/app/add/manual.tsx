import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Text, IconButton, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recipeService } from '../../services/api';

export default function ManualEntryScreen() {
  const router = useRouter();
  const { initialData } = useLocalSearchParams();
  
  const [title, setTitle] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  
  const [ingredients, setIngredients] = useState<any[]>([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState<any[]>([{ instruction: '', timer_seconds: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      try {
        const data = JSON.parse(initialData as string);
        setTitle(data.title || '');
        setPrepTime(data.prep_time_minutes?.toString() || '');
        setCookTime(data.cook_time_minutes?.toString() || '');
        setServings(data.servings?.toString() || '');
        setIngredients(data.ingredients || [{ name: '', quantity: '', unit: '' }]);
        setSteps(data.steps || [{ instruction: '', timer_seconds: '' }]);
      } catch (e) {
        console.error("Failed to parse initial data", e);
      }
    }
  }, [initialData]);

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addStep = () => setSteps([...steps, { instruction: '', timer_seconds: '' }]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        title,
        prep_time_minutes: parseInt(prepTime) || 0,
        cook_time_minutes: parseInt(cookTime) || 0,
        servings: parseInt(servings) || 1,
        ingredients: ingredients.map(i => ({ ...i, quantity: parseFloat(i.quantity) || 0 })),
        steps: steps.map((s, i) => ({ 
          instruction: s.instruction, 
          order_index: i + 1, 
          timer_seconds: parseInt(s.timer_seconds) || null 
        }))
      };
      
      await recipeService.create(payload);
      router.dismissAll();
      router.replace('/(tabs)/');
    } catch (error) {
      console.error(error);
      alert('Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Edit Recipe' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TextInput label="Recipe Title" value={title} onChangeText={setTitle} style={styles.input} />
        
        <View style={styles.row}>
          <TextInput label="Prep (min)" value={prepTime} onChangeText={setPrepTime} style={[styles.input, styles.half]} keyboardType="numeric" />
          <TextInput label="Cook (min)" value={cookTime} onChangeText={setCookTime} style={[styles.input, styles.half]} keyboardType="numeric" />
        </View>
        <TextInput label="Servings" value={servings} onChangeText={setServings} style={styles.input} keyboardType="numeric" />

        <Divider style={styles.divider} />
        <Text variant="titleMedium">Ingredients</Text>
        {ingredients.map((ing, i) => (
          <View key={i} style={styles.row}>
            <TextInput placeholder="Name" value={ing.name} onChangeText={v => updateIngredient(i, 'name', v)} style={[styles.input, { flex: 2 }]} />
            <TextInput placeholder="Qty" value={String(ing.quantity)} onChangeText={v => updateIngredient(i, 'quantity', v)} style={[styles.input, { flex: 1 }]} keyboardType="numeric" />
            <TextInput placeholder="Unit" value={ing.unit} onChangeText={v => updateIngredient(i, 'unit', v)} style={[styles.input, { flex: 1 }]} />
            <IconButton icon="delete" onPress={() => removeIngredient(i)} />
          </View>
        ))}
        <Button mode="text" onPress={addIngredient} icon="plus">Add Ingredient</Button>

        <Divider style={styles.divider} />
        <Text variant="titleMedium">Steps</Text>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepContainer}>
            <View style={styles.row}>
              <Text style={styles.stepNum}>{i + 1}.</Text>
              <IconButton icon="delete" onPress={() => removeStep(i)} size={20} />
            </View>
            <TextInput 
              placeholder="Instruction..." 
              value={step.instruction} 
              onChangeText={v => updateStep(i, 'instruction', v)} 
              multiline 
              style={styles.input} 
            />
            <TextInput 
              label="Timer (seconds)" 
              value={String(step.timer_seconds || '')} 
              onChangeText={v => updateStep(i, 'timer_seconds', v)} 
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        ))}
        <Button mode="text" onPress={addStep} icon="plus">Add Step</Button>

        <View style={styles.spacer} />
        <Button mode="contained" onPress={handleSave} loading={loading} disabled={loading}>
          Save Recipe
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  half: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  stepContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    borderRadius: 8,
  },
  stepNum: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  spacer: {
    height: 32,
  }
});
