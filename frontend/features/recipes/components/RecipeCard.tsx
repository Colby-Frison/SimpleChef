import React from 'react';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface RecipeCardProps {
  id: number;
  title: string;
  image?: string;
  prepTime: number;
  difficulty: string;
  onPress: () => void;
}

export const RecipeCard = ({ id, title, image, prepTime, difficulty, onPress }: RecipeCardProps) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} onPress={onPress}>
      {image && <Card.Cover source={{ uri: image }} />}
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <Chip icon="clock" style={styles.chip} compact>{prepTime} min</Chip>
          <Chip icon="chef-hat" style={styles.chip} compact>{difficulty}</Chip>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  content: {
    marginTop: 8,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  }
});
