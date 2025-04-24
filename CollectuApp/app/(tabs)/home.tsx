import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

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

  const collectionValue = 107.99;
  const paidValue = 174.69;
  const percentageChange = -38.18;

  const stats = {
    ungraded: 33,
    sealed: 0,
    graded: 0
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Viewing All Groups</Text>
          <TouchableOpacity style={styles.currencyButton}>
            <Text style={styles.currencyText}>EUR</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>La tua collezione vale</Text>
          <Text style={styles.valueAmount}>€{collectionValue.toFixed(2)}</Text>
          <View style={styles.paidContainer}>
            <Text style={styles.paidText}>Pagato €{paidValue.toFixed(2)}</Text>
            <Text style={[styles.changeText, { color: percentageChange >= 0 ? '#4CAF50' : '#FF3B30' }]}>
              ({percentageChange.toFixed(2)}%)
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.ungraded}</Text>
            <Text style={styles.statLabel}>Ungraded</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.sealed}</Text>
            <Text style={styles.statLabel}>Sealed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.graded}</Text>
            <Text style={styles.statLabel}>Graded</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top 5 Most Valuable</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.cardList}>
            {dummyExpensiveCards.map(card => (
              <TouchableOpacity key={card.id} style={styles.cardItem} onPress={() => router.push(`/card/${card.id}`)}>
                <Image source={{ uri: card.smallImageUrl }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardPrice}>€{card.price.toFixed(2)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 8,
    borderRadius: 8,
  },
  currencyText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
  },
  valueContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  valueLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  valueAmount: {
    fontSize: 48,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidText: {
    color: '#999',
    marginRight: 4,
  },
  changeText: {
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#999',
    fontSize: 14,
  },
  section: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  cardList: {
    padding: 8,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cardImage: {
    width: 50,
    height: 70,
    borderRadius: 4,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardPrice: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;