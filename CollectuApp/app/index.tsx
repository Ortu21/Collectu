import { Text, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { user, logout, isAuthLoading } = useAuth(); // Aggiunto user e isAuthLoading
  const router = useRouter();

  useEffect(() => {
    // Non fare nulla mentre l'autenticazione sta caricando
    if (isAuthLoading) {
      return;
    }

    // Se l'utente non è loggato, reindirizza al login
    if (!user) {
      router.replace('/login');
    } else {
      // Se l'utente è loggato, reindirizza alla nuova home
      router.replace('/home');
    }
  }, [user, isAuthLoading, router]);

  // Mostra un indicatore di caricamento mentre si controlla lo stato di autenticazione
  if (isAuthLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
      {/* Potresti voler rimuovere i pulsanti qui se il reindirizzamento è garantito */}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  text: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
  },
});
