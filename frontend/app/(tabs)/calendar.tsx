import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, Portal, Modal, TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { plannerService } from '../../services/api';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [plans, setPlans] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    loadPlans();
  }, [selectedDate]);

  const loadPlans = async () => {
    // Just load specifically for selected date for now, or range
    try {
      const data = await plannerService.getPlans(selectedDate, selectedDate);
      setPlans(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addMeal = async () => {
    try {
      await plannerService.addPlan({
        date: selectedDate,
        meal_type: "Dinner", // Default
        custom_food_name: mealName,
        calories: parseInt(calories) || 0
      });
      setModalVisible(false);
      setMealName('');
      setCalories('');
      loadPlans();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Meal Planner</Text>
        <Text variant="titleMedium">{selectedDate}</Text>
        {/* Date picker placeholder */}
      </View>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.custom_food_name || "Recipe Meal"} subtitle={`${item.calories || 0} kcal`} />
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No meals planned for today.</Text>}
        contentContainerStyle={styles.list}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        label="Add Meal"
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge">Quick Add Meal</Text>
          <TextInput label="Food Name" value={mealName} onChangeText={setMealName} />
          <TextInput label="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" />
          <Button mode="contained" onPress={addMeal}>Add</Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    gap: 16,
  }
});
