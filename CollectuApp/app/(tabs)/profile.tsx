import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth'; // Assicurati che il percorso sia corretto
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilo Utente</Text>
      {user ? (
        <View>
          <Text style={styles.text}>Email: {user.email}</Text>
          {/* Aggiungi altre informazioni del profilo qui */}
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>Caricamento informazioni utente...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Sfondo scuro
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF3B30', // Rosso per logout
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;