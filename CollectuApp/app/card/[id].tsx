import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { fetchPokemonCardById } from '../../services/api';
import { PokemonCard } from '../../types/pokemon';
import { Ionicons } from '@expo/vector-icons';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [card, setCard] = useState<PokemonCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const cardData = await fetchPokemonCardById(id);
        setCard(cardData);
        setError(null);
      } catch (err) {
        console.error('Error loading card:', err);
        setError('Failed to load card details');
      } finally {
        setIsLoading(false);
      }
    };

    loadCard();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading card details...</Text>
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Card not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{card.name}</Text>
      </View>
      
      <View style={styles.cardImageContainer}>
        {/* Utilizziamo l'immagine grande per i dettagli della carta */}
        <Image 
          source={{ uri: card.largeImageUrl }} 
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Set:</Text>
          <Text style={styles.infoValue}>{card.setName || 'Unknown'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Number:</Text>
          <Text style={styles.infoValue}>{card.number || 'Unknown'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rarity:</Text>
          <Text style={styles.infoValue}>{card.rarity || 'Unknown'}</Text>
        </View>
        
        {card.hp && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>HP:</Text>
            <Text style={styles.infoValue}>{card.hp}</Text>
          </View>
        )}
        
        {card.supertype && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{card.supertype}</Text>
          </View>
        )}
        
        {card.evolvesFrom && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Evolves From:</Text>
            <Text style={styles.infoValue}>{card.evolvesFrom}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
    flex: 1,
  },
  cardImageContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  cardImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#444',
  },
  cardInfo: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaa',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
});