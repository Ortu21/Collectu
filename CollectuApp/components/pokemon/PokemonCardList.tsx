import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { PokemonCard } from '../../types/pokemon';
import { PokemonCardItem } from './PokemonCard';

interface PokemonCardListProps {
  cards: PokemonCard[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  totalCount: number;
  onRefresh: () => void;
  onLoadMore: () => void;
  onCardPress: (card: PokemonCard) => void;
  numColumns?: number;
}

export const PokemonCardList = ({
  cards,
  isLoading,
  isLoadingMore,
  error,
  totalCount,
  onRefresh,
  onLoadMore,
  onCardPress,
  numColumns = 2,
}: PokemonCardListProps) => {
  const { width } = useWindowDimensions();
  
  // Calcola le dimensioni ottimali per le carte in base alla larghezza dello schermo
  const getCardDimensions = () => {
    const padding = 16; // Padding totale orizzontale
    const gap = 16; // Spazio tra le carte
    const availableWidth = width - padding;
    const cardWidth = (availableWidth - (gap * (numColumns - 1))) / numColumns;
    
    // Altezza proporzionale per mantenere il rapporto della carta
    const cardHeight = cardWidth * 1.4;
    
    return {
      width: cardWidth,
      height: cardHeight,
      // Modifica qui: rimuoviamo maxWidth come stringa percentuale
    };
  };
  
  const cardDimensions = getCardDimensions();

  return (
    <FlatList
      data={cards}
      numColumns={numColumns}
      key={`list-${numColumns}`}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={[
            styles.card, 
            { 
              // Modifica qui: usiamo una percentuale valida per React Native
              width: cardDimensions.width,
              margin: 8,
            }
          ]} 
          onPress={() => onCardPress(item)}
        >
          <PokemonCardItem 
            card={item} 
            onPress={onCardPress} 
            cardDimensions={cardDimensions}
          />
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={styles.cardList}
      onRefresh={onRefresh}
      refreshing={isLoading}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={() => (
        <View style={styles.footerLoader}>
          {isLoadingMore && (
            <>
              <ActivityIndicator size="small" color="#aaa" />
              <Text style={styles.footerText}>Loading more cards...</Text>
            </>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  cardList: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#aaa",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    width: 120,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 16,
  },
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  footerText: {
    color: "#aaa",
    fontSize: 14,
    marginLeft: 8,
  },
});