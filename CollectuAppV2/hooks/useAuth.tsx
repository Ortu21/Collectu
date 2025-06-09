import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { registerUser } from '../services/userApi';

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  user: any | null;
  isAuthLoading: boolean;
  register: (email: string, password: string, userName: string) => Promise<void>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const REMEMBER_ME_KEY = '@rememberMe';

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const useFirebaseAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, userName: string) => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await registerUser({
        firebaseUid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userName,
        photoUrl: userCredential.user.photoURL || undefined,
        emailVerified: userCredential.user.emailVerified,
        phoneNumber: userCredential.user.phoneNumber || undefined,
        providerId: userCredential.user.providerId,
        creationTime: new Date(userCredential.user.metadata.creationTime || ''),
        lastSignInTime: new Date(userCredential.user.metadata.lastSignInTime || '')
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la registrazione');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
      try {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
      } catch (e) {
        // ignore
      }
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
      try {
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      } catch (e) {
        // ignore
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante il logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante l\'invio dell\'email di reset');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isAuthLoading,
    error,
    user,
    register,
    login,
    logout,
    sendPasswordReset
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authValues = useFirebaseAuth();
  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>;
};
