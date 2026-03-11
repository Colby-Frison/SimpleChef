import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [token]);

  const loadUser = async () => {
    if (!token) return;
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {user ? (
          <>
            <Text variant="headlineSmall" style={styles.name}>
              {user.full_name || 'User'}
            </Text>
            <Text variant="bodyMedium" style={styles.email}>
              {user.email}
            </Text>
            <Text variant="bodySmall" style={styles.calorie}>
              Calorie goal: {user.calorie_goal || 2000} kcal/day
            </Text>
          </>
        ) : (
          <Text variant="bodyLarge">Profile</Text>
        )}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.button}
          icon="logout"
        >
          Sign Out
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
    flex: 1,
    padding: 24,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    opacity: 0.8,
    marginBottom: 8,
  },
  calorie: {
    opacity: 0.6,
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
});
