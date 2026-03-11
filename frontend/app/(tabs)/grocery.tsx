import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { Text, Checkbox, FAB, List, TextInput, Modal, Portal, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { groceryService } from '../../services/api';

export default function GroceryScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    try {
      const data = await groceryService.get();
      setItems(data.items);
      groupItems(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const groupItems = (allItems: any[]) => {
    const grouped = allItems.reduce((acc, item) => {
      const cat = item.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    const sectionData = Object.keys(grouped).map(key => ({
      title: key,
      data: grouped[key]
    }));
    setSections(sectionData);
  };

  const toggleItem = async (id: number, currentStatus: boolean) => {
    try {
      await groceryService.updateItem(id, { is_checked: !currentStatus });
      // Optimistic update
      const newItems = items.map(i => i.id === id ? { ...i, is_checked: !currentStatus } : i);
      setItems(newItems);
      groupItems(newItems);
    } catch (error) {
      console.error(error);
    }
  };

  const addItem = async () => {
    try {
      await groceryService.addItem({
        name: itemName,
        quantity: 1,
        unit: 'pc',
        category: 'Uncategorized'
      });
      setModalVisible(false);
      setItemName('');
      loadList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>Grocery List</Text>
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.quantity || ''} ${item.unit || ''}`}
            left={() => (
              <Checkbox
                status={item.is_checked ? 'checked' : 'unchecked'}
                onPress={() => toggleItem(item.id, item.is_checked)}
              />
            )}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text variant="titleSmall" style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.list}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        label="Add Item"
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge">Add Item</Text>
          <TextInput label="Item Name" value={itemName} onChangeText={setItemName} />
          <Button mode="contained" onPress={addItem}>Add</Button>
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
    textAlign: 'center',
  },
  list: {
    paddingBottom: 80,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    fontWeight: 'bold',
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
