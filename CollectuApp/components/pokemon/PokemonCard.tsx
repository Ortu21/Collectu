import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { PokemonCard as PokemonCardType } from '../../types/pokemon';

interface PokemonCardProps {
  card: PokemonCardType;
  onPress: (card: PokemonCardType) => void;
}

export const PokemonCardItem = ({ card, onPress }: PokemonCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(card)}>
      <Image
        source={{ uri: card.imageUrl }}
        style={styles.cardImage}
        resizeMode="contain"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardType}>{card.supertype}</Text>
        {card.rarity && (
          <Text style={styles.cardRarity}>Rarity: {card.rarity}</Text>
        )}
        {card.setName && (
          <Text style={styles.cardSet}>Set: {card.setName}</Text>
        )}
        {card.number && (
          <Text style={styles.cardNumber}>Number: {card.number}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    maxWidth: "47%",
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#444",
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 4,
  },
  cardRarity: {
    fontSize: 12,
    color: "#007AFF",
    marginBottom: 4,
  },
  cardSet: {
    fontSize: 12,
    color: "#6c757d",
  },
  cardNumber: {
    fontSize: 12,
    color: "#6c757d",
  },
});