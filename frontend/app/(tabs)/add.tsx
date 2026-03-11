import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, Modal, Portal, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { recipeService } from '../../services/api';

export default function AddScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleManual = () => {
    router.push('/add/manual');
  };

  const handleParse = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const parsedData = await recipeService.parse(text);
      // Pass data to manual screen (edit mode)
      // We can use context or params. Params for large objects might be tricky in some navs, 
      // but expo-router handles generic objects via params if stringified.
      router.push({
        pathname: '/add/manual',
        params: { initialData: JSON.stringify(parsedData) }
      });
      setModalVisible(false);
      setText('');
    } catch (error) {
      console.error(error);
      alert('Failed to parse recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.header}>Add New Recipe</Text>
        
        <Button 
          mode="contained" 
          icon="pencil" 
          onPress={handleManual} 
          style={styles.button}
        >
          Enter Manually
        </Button>

        <Button 
          mode="contained" 
          icon="magic-staff" 
          onPress={() => setModalVisible(true)} 
          style={styles.button}
        >
          Paste Text / URL (AI)
        </Button>

        <Button 
          mode="outlined" 
          icon="camera" 
          onPress={() => {}} 
          style={styles.button}
          disabled
        >
          Scan Image (Coming Soon)
        </Button>
      </View>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge">Paste Recipe Text</Text>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={6}
            value={text}
            onChangeText={setText}
            placeholder="Paste ingredients and instructions here..."
            style={styles.input}
          />
          <Button 
            mode="contained" 
            onPress={handleParse} 
            loading={loading}
            disabled={loading || !text}
          >
            Parse with AI
          </Button>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    paddingVertical: 8,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    gap: 16,
  },
  input: {
    maxHeight: 200,
  }
});
