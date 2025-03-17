import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // User is not logged in, redirect to login page
      router.replace('/login');
    }
  }, [user, loading, router]);

  // If still loading or user is not logged in, don't render the main content
  if (loading || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/pokemon" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Go to Pokemon</Text>
        </Pressable>
      </Link>
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
});
