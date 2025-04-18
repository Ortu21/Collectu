import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'; // Aggiunto TouchableOpacity e Image
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

// Dati fittizi per le carte più costose (mantenuti per esempio)
const dummyExpensiveCards = [
  { id: '1', name: 'Charizard VMAX', price: 120.50, smallImageUrl: 'https://images.pokemontcg.io/swsh35/19_hires.png' }, // Esempio con URL reale
  { id: '2', name: 'Pikachu Illustrator', price: 900000.00, smallImageUrl: 'https://images.pokemontcg.io/si1/1_hires.png' }, // Esempio con URL reale
  { id: '3', name: 'Blastoise #009/165R', price: 85.00, smallImageUrl: 'https://images.pokemontcg.io/xy12/12_hires.png' }, // Esempio con URL reale
  { id: '4', name: 'Umbreon Gold Star', price: 70000.00, smallImageUrl: 'https://images.pokemontcg.io/pop5/17_hires.png' }, // Esempio con URL reale
  { id: '5', name: 'Lugia Neo Genesis', price: 144000.00, smallImageUrl: 'https://images.pokemontcg.io/neo1/9_hires.png' }, // Esempio con URL reale
];

const HomeScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Benvenuto, {user?.email || 'Utente'}!</Text>

      {/* Sezione Ricerca Carte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ricerca Carte</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/collectibles')}>
          <Text style={styles.buttonText}>Vai alla Ricerca</Text>
        </TouchableOpacity>
      </View>

      {/* Sezione Anteprima Carte Costose */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Le tue Carte più Preziose</Text>
        <View style={styles.cardPreviewContainer}>
          {dummyExpensiveCards.map(card => (
            <TouchableOpacity key={card.id} style={styles.cardPreviewItem} onPress={() => router.push(`/card/${card.id}`)}>
              <Image source={{ uri: card.smallImageUrl }} style={styles.cardImage} />
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardPrice}>€{card.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Link rimosso o da aggiornare se esiste una pagina dedicata */}
        {/* <Link href="/expensive-cards" style={styles.link}>Vedi tutte</Link> */}
      </View>

      {/* Sezione Profilo e Logout */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/profile')}> 
          <Text style={styles.buttonText}>Visualizza Profilo</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e', // Sfondo scuro come collectibles.tsx
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Testo bianco
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#333', // Sfondo sezione scuro
    padding: 15,
    borderRadius: 8,
    // Rimosse ombre, meno comuni in dark theme puro
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff', // Testo bianco
  },
  button: { // Stile bottone personalizzato
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { // Testo del bottone
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: { // Stile specifico per il bottone logout
    backgroundColor: '#FF3B30', // Rosso per logout
  },
  cardPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  cardPreviewItem: {
    alignItems: 'center',
    marginBottom: 15,
    width: '30%', // Mantiene 3 card per riga circa
    backgroundColor: '#444', // Sfondo card leggermente più chiaro
    borderRadius: 8,
    padding: 10,
  },
  cardImage: {
    width: 60,
    height: 84,
    marginBottom: 8,
    resizeMode: 'contain',
    backgroundColor: '#555', // Placeholder scuro per immagine
    borderRadius: 4,
  },
  cardName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#eee', // Testo chiaro
    fontWeight: 'bold',
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50', // Verde per il prezzo mantenuto
    marginTop: 4,
  },
  link: { // Stile link aggiornato
    marginTop: 10,
    color: '#00AFFF', // Blu più brillante per dark theme
    textAlign: 'right',
    fontWeight: 'bold',
  },
  spacer: {
    height: 15, // Aumentato leggermente lo spazio
  },
});

export default HomeScreen;