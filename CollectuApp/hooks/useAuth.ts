import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth'; // Aggiunti setPersistence e tipi
import { auth } from '../firebase/config';
import { registerUser } from '../services/userApi';

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  user: any | null;
  isAuthLoading: boolean; // Stato per il caricamento iniziale dell'autenticazione
  register: (email: string, password: string, userName: string) => Promise<void>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>; // Aggiunto rememberMe
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>; // Aggiunta funzione reset password
}

const REMEMBER_ME_KEY = '@rememberMe';

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Inizializza a true
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Controlla lo stato di autenticazione all'avvio
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false); // Imposta a false dopo il controllo iniziale
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, userName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Registrazione con Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Registrazione nel backend
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

  // Funzione per controllare se l'utente ha scelto "ricordami"
  const checkRememberMe = async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      return value === 'true';
    } catch (e) {
      console.error('Failed to fetch remember me status', e);
      return false;
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      setError(null);

      // Imposta la persistenza della sessione
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);

      await signInWithEmailAndPassword(auth, email, password);

      // Salva la preferenza "ricordami" in AsyncStorage
      try {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
      } catch (e) {
        console.error('Failed to save remember me status', e);
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
        console.error('Failed to remove remember me status', e);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Si è verificato un errore durante il logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sposto la definizione di sendPasswordReset qui dentro
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
    isAuthLoading, // Esporta il nuovo stato
    error,
    user,
    register,
    login,
    logout,
    sendPasswordReset // Esporta la nuova funzione
  };
};

// Rimuovo la definizione esterna di sendPasswordReset