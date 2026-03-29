import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Button,
  ActivityIndicator,
  TextInput,
  Switch,
  Divider,
  Snackbar,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../theme/spacing';
import { useProfileController } from '../../controllers';

const DIETARY_PRESETS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free'];

export default function ProfileScreen() {
  const theme = useTheme();
  const c = useProfileController();

  if (c.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="headlineSmall" style={styles.title}>
          Profile
        </Text>
        <Text variant="bodySmall" style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
          Friends / social features are out of scope for this build; see CONTINUATION_CHECKLIST.
        </Text>

        <TextInput label="Full name" value={c.fullName} onChangeText={c.setFullName} mode="outlined" style={styles.field} />
        <TextInput label="Bio" value={c.bio} onChangeText={c.setBio} mode="outlined" multiline style={styles.field} />
        <TextInput
          label="Calorie goal (kcal/day)"
          value={c.calorieGoal}
          onChangeText={c.setCalorieGoal}
          keyboardType="numeric"
          mode="outlined"
          style={styles.field}
        />
        <TextInput
          label="Dietary restrictions (comma-separated)"
          value={c.dietaryText}
          onChangeText={c.setDietaryText}
          mode="outlined"
          placeholder={DIETARY_PRESETS.join(', ')}
          style={styles.field}
        />

        <View style={styles.row}>
          <Text variant="bodyLarge">Keep screen on while cooking</Text>
          <Switch value={c.keepAwake} onValueChange={c.setKeepAwake} accessibilityLabel="Keep screen on while cooking" />
        </View>

        <Button mode="contained" onPress={c.save} loading={c.saving} disabled={c.saving} style={styles.save}>
          Save
        </Button>

        <Divider style={styles.divider} />

        <Button mode="outlined" onPress={c.logoutAndGoLogin} style={styles.button} icon="logout" accessibilityLabel="Sign out">
          Sign out
        </Button>
      </ScrollView>
      <Snackbar visible={!!c.snackbar} onDismiss={() => c.setSnackbar(null)} duration={3000}>
        {c.snackbar}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  hint: {
    marginBottom: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  save: {
    marginTop: spacing.sm,
  },
  divider: {
    marginVertical: spacing.xl,
  },
  button: {
    marginTop: spacing.sm,
  },
});
