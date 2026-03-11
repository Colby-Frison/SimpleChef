import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(':')[0];

    if (localhost) {
      return `http://${localhost}:8000/api/v1`;
    }

    return Platform.OS === 'android' ? 'http://10.0.2.2:8000/api/v1' : 'http://localhost:8000/api/v1';
  }

  return 'http://localhost:8000/api/v1';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { useAuthStore } = await import('../store/useAuthStore');
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const { useAuthStore } = require('../store/useAuthStore');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post('/login/access-token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  signup: async (data: { email: string; password: string; full_name?: string }) => {
    const response = await api.post('/users/', data);
    return response.data;
  },
};

export const recipeService = {
  getAll: async () => {
    const response = await api.get('/recipes/');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/recipes/', data);
    return response.data;
  },
  parse: async (text: string) => {
    const response = await api.post('/recipes/parse', null, { params: { text } });
    return response.data;
  }
};

export const plannerService = {
  getPlans: async (startDate: string, endDate: string) => {
    const response = await api.get('/planner/', { params: { start_date: startDate, end_date: endDate } });
    return response.data;
  },
  addPlan: async (data: any) => {
    const response = await api.post('/planner/', data);
    return response.data;
  }
};

export const groceryService = {
  get: async () => {
    const response = await api.get('/grocery/');
    return response.data;
  },
  addItem: async (data: any) => {
    const response = await api.post('/grocery/items', data);
    return response.data;
  },
  updateItem: async (id: number, data: any) => {
    const response = await api.put(`/grocery/items/${id}`, data);
    return response.data;
  }
};