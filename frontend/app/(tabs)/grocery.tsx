import React from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { Text, Checkbox, FAB, List, TextInput, Modal, Portal, Button, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../theme/spacing';
import { useGroceryController } from '../../controllers';

export default function GroceryScreen() {
  const theme = useTheme();
  const c = useGroceryController();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.toolbar}>
        <Text variant="headlineSmall" style={styles.header}>
          Grocery list
        </Text>
        <View style={styles.toolbarBtns}>
          <Button mode="outlined" compact onPress={c.mergeFromPlan} loading={c.merging} disabled={c.merging}>
            From plan
          </Button>
          <Button mode="text" compact onPress={c.shareList}>
            Share
          </Button>
        </View>
      </View>

      <SectionList
        sections={c.sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={`${item.quantity || ''} ${item.unit || ''}`}
            left={() => (
              <Checkbox
                status={item.is_checked ? 'checked' : 'unchecked'}
                onPress={() => c.toggleItem(item.id, item.is_checked)}
              />
            )}
            right={() => (
              <IconButton icon="delete-outline" onPress={() => c.removeItem(item.id)} accessibilityLabel={`Delete ${item.name}`} />
            )}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            variant="titleSmall"
            style={[
              styles.sectionHeader,
              { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.onSurfaceVariant },
            ]}
          >
            {title}
          </Text>
        )}
        contentContainerStyle={styles.list}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => c.setModalVisible(true)}
        label="Add Item"
      />

      <Portal>
        <Modal
          visible={c.modalVisible}
          onDismiss={() => c.setModalVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleLarge">Add Item</Text>
          <TextInput label="Item Name" value={c.itemName} onChangeText={c.setItemName} />
          <Button mode="contained" onPress={c.addItem}>Add</Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  header: {
    marginBottom: spacing.xs,
  },
  toolbarBtns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  list: {
    paddingBottom: 80,
  },
  sectionHeader: {
    padding: spacing.sm,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
  },
  modal: {
    padding: spacing.xl,
    margin: spacing.lg,
    borderRadius: 8,
    gap: spacing.lg,
  },
});
