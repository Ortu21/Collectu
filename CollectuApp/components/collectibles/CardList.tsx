import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, useWindowDimensions, Animated } from 'react-native';
import { PokemonCard } from '../../types/pokemon';
import { CardItem } from './CardItem';
import { CardSkeleton } from './CardSkeleton';

interface CardListProps {
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

export const CardList = ({
  cards,
  isLoading,
  isLoadingMore,
  error,
  totalCount,
  onRefresh,
  onLoadMore,
  onCardPress,
  numColumns = 2,
}: CardListProps) => {
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

  // Funzione comune per renderizzare sia le carte che gli skeleton
  const renderCardItem = ({ item, index }: { item: PokemonCard | number, index: number }) => {
    const itemDelay = index * 50;
    const isSkeletonItem = typeof item === 'number';
    
    return (
      <TouchableOpacity 
        style={[
          styles.card, 
          { 
            width: cardDimensions.width,
            margin: 8,
          }
        ]} 
        onPress={isSkeletonItem ? undefined : () => onCardPress(item as PokemonCard)}
        disabled={isSkeletonItem}
      >
        {isSkeletonItem ? (
          <Animated.View style={[styles.container, { opacity: 1 }]}>
            <CardSkeleton cardDimensions={cardDimensions} animationDelay={itemDelay} />
          </Animated.View>
        ) : (
          <CardItem 
            card={item as PokemonCard} 
            onPress={onCardPress} 
            cardDimensions={cardDimensions}
            animationDelay={itemDelay}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  // Genera un array di numeri per gli skeleton
  const generateSkeletonData = () => {
    return Array.from({ length: 10 }, (_, i) => i);
  };
  
  const skeletonData = generateSkeletonData();

  // Funzione per renderizzare gli skeleton durante il caricamento
  const renderSkeletons = () => {
    return (
      <FlatList
        data={skeletonData}
        numColumns={numColumns}
        key={`skeleton-list-${numColumns}`}
        renderItem={renderCardItem}
        keyExtractor={(item, index) => `skeleton-${index}`}
        contentContainerStyle={styles.cardList}
      />
    );
  };

  return (
    <>
      {isLoading ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={cards}
          numColumns={numColumns}
          key={`list-${numColumns}`}
          renderItem={renderCardItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={styles.cardList}
      onRefresh={onRefresh}
      refreshing={isLoading}
      onEndReached={onLoadMore}
      onEndReachedThreshold={5}
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
      )}    
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    // Utilizziamo lo stesso layout della FlatList per garantire coerenza
    // tra gli skeleton e le carte reali
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