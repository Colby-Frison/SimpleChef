import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { RecipeList } from '../../features/recipes/components/RecipeList';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="SimpleChef" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon="filter-variant" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.content}>
        <RecipeList />
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
    flex: 1,
  }
});
