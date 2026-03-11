import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton, ProgressBar, useTheme } from 'react-native-paper';
import { useTimerStore } from '../../../store/useTimerStore';

export const TimerDock = () => {
  const { timers, toggleTimer, removeTimer } = useTimerStore();
  const theme = useTheme();

  if (timers.length === 0) return null;

  // Sort by remaining time (least first)
  const activeTimers = [...timers].sort((a, b) => a.remaining - b.remaining);
  const topTimer = activeTimers[0];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={styles.container}>
      {activeTimers.length > 1 && <View style={[styles.stackCard, { backgroundColor: theme.colors.elevation.level2 }]} />}
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.row}>
            <Text variant="titleMedium">{topTimer.label}</Text>
            <Text variant="headlineMedium" style={{ color: topTimer.status === 'completed' ? 'red' : theme.colors.primary }}>
              {formatTime(topTimer.remaining)}
            </Text>
          </View>
          <ProgressBar progress={1 - (topTimer.remaining / topTimer.duration)} style={styles.progress} />
          <View style={styles.controls}>
             <IconButton 
                icon={topTimer.status === 'running' ? 'pause' : 'play'} 
                onPress={() => toggleTimer(topTimer.id)} 
             />
             <IconButton icon="close" onPress={() => removeTimer(topTimer.id)} />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
  },
  stackCard: {
    height: 10,
    marginHorizontal: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: -5,
  },
  card: {
    elevation: 4,
  },
  content: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    marginVertical: 8,
    height: 6,
    borderRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -8,
  }
});
