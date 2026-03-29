import { useState } from 'react';
import { useRouter } from 'expo-router';
import { recipeService } from '../services/api';

export function useAddRecipeController() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const goManual = () => {
    router.push('/add/manual');
  };

  const parseAndContinue = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const parsedData = await recipeService.parse(text);
      router.push({
        pathname: '/add/manual',
        params: { initialData: JSON.stringify(parsedData) },
      });
      setModalVisible(false);
      setText('');
    } catch (error) {
      console.error(error);
      setSnackbar('Failed to parse recipe. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    text,
    setText,
    modalVisible,
    setModalVisible,
    loading,
    snackbar,
    setSnackbar,
    goManual,
    parseAndContinue,
  };
}
