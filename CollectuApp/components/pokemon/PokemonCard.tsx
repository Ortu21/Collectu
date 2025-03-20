import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { PokemonCard } from '../../types/pokemon';

interface PokemonCardItemProps {
  card: PokemonCard;
  onPress: (card: PokemonCard) => void;
  cardDimensions?: {
    width: number;
    height: number;
  };
}

export const PokemonCardItem = ({ card, onPress, cardDimensions }: PokemonCardItemProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: card.imageUrl }}
        style={[
          styles.cardImage,
          cardDimensions ? { height: cardDimensions.height * 0.6 } : null
        ]}
        resizeMode="contain"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="tail">
          {card.name}
        </Text>
        <Text style={styles.cardRarity} numberOfLines={1} ellipsizeMode="tail">
          {card.rarity || 'Common'}
        </Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardSet} numberOfLines={1} ellipsizeMode="tail">
            {card.setName || 'Unknown Set'}
          </Text>
          <Text style={styles.cardNumber}>
            {card.number || '?'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#444',
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  cardRarity: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 4,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSet: {
    fontSize: 12,
    color: '#6c757d',
    flex: 1,
  },
  cardNumber: {
    fontSize: 12,
    color: '#6c757d',
  },
});