import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('User:', user);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

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
      <Link href="/login" asChild>
        <Pressable style={styles.logoutButton}>
          <Text style={styles.buttonText}>Logout</Text>
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
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 8,
  },
});
