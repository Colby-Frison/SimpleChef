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

export function useSignupController() {
  const setToken = useAuthStore((s) => s.setToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signup = async (onSuccess: () => void) => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.signup({ email, password, full_name: fullName || undefined });
    } catch (err) {
      setError(
        formatApiError(err, 'Signup failed. Check that the backend is running and reachable.')
      );
      setLoading(false);
      return;
    }
    try {
      const data = await authService.login(email, password);
      await setToken(data.access_token);
    } catch {
      setError('Account created! Go back and sign in.');
      setLoading(false);
      return;
    }
    setLoading(false);
    onSuccess();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    error,
    setError,
    signup,
  };
}
