import { useCallback, useEffect, useState } from 'react';
import { Share } from 'react-native';
import { groceryService } from '../services/api';
import type { GroceryItemDto, GrocerySection } from '../types';

function groupItems(allItems: GroceryItemDto[]): GrocerySection[] {
  const grouped = allItems.reduce<Record<string, GroceryItemDto[]>>((acc, item) => {
    const cat = item.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  return Object.keys(grouped).map((title) => ({ title, data: grouped[title] }));
}

export function useGroceryController() {
  const [items, setItems] = useState<GroceryItemDto[]>([]);
  const [sections, setSections] = useState<GrocerySection[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [merging, setMerging] = useState(false);

  const loadList = useCallback(async () => {
    try {
      const data = await groceryService.get();
      setItems(data.items);
      setSections(groupItems(data.items));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const toggleItem = async (id: number, currentStatus: boolean) => {
    const next = !currentStatus;
    const prevItems = items;
    const optimistic = items.map((i) => (i.id === id ? { ...i, is_checked: next } : i));
    setItems(optimistic);
    setSections(groupItems(optimistic));
    try {
      await groceryService.updateItem(id, { is_checked: next });
    } catch (error) {
      console.error(error);
      setItems(prevItems);
      setSections(groupItems(prevItems));
    }
  };

  const mergeFromPlan = async () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    setMerging(true);
    try {
      await groceryService.mergeFromPlan(fmt(start), fmt(end));
      await loadList();
    } catch (e) {
      console.error(e);
    } finally {
      setMerging(false);
    }
  };

  const shareList = async () => {
    try {
      const text = await groceryService.exportText();
      await Share.share({ message: text, title: 'Grocery list' });
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await groceryService.deleteItem(id);
      loadList();
    } catch (e) {
      console.error(e);
    }
  };

  const addItem = async () => {
    try {
      await groceryService.addItem({
        name: itemName,
        quantity: 1,
        unit: 'pc',
        category: 'Uncategorized',
      });
      setModalVisible(false);
      setItemName('');
      loadList();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    items,
    sections,
    modalVisible,
    setModalVisible,
    itemName,
    setItemName,
    merging,
    loadList,
    toggleItem,
    mergeFromPlan,
    shareList,
    removeItem,
    addItem,
  };
}
