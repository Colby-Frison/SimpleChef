import { useState } from 'react';
import { authService } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

function formatApiError(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { detail?: unknown } }; message?: string };
  const detail = e.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg);
  return e.message || fallback;
}

export function useAuthController() {
  const setToken = useAuthStore((s) => s.setToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (onSuccess: () => void) => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(email, password);
      await setToken(data.access_token);
      onSuccess();
    } catch (err) {
      setError(formatApiError(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    setError,
    login,
  };
}
