import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { registerUser } from '../services/userApi';

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  register: (email: string, password: string, userName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string, userName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Registrazione con Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Registrazione nel backend
      await registerUser({
        firebaseUid: userCredential.user.uid,
        userName: userName
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la registrazione');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante il login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante il logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    register,
    login,
    logout
  };
}; 