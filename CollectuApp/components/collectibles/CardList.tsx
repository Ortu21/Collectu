import React from "react";
import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Platform,
  ViewStyle,
} from "react-native";
import { YStack, XStack, Text, Card, Spinner } from "tamagui";
import { PokemonCard } from "../../types/pokemon";
import { CardItem } from "./CardItem";
import { Skeleton } from "./Skeleton";

interface CardListProps {
  cards: PokemonCard[];
  isLoading: boolean; // Questo stato indica il caricamento iniziale o il refresh
  isLoadingMore: boolean;
  error: string | null;
  totalCount: number;
  onRefresh: () => void;
  onLoadMore: () => void;
  onCardPress: (card: PokemonCard) => void;
  numColumns?: number;
}

// Usa solo variabili di tema Tamagui per tutti i colori e sfondi
// Rimuovi ogni oggetto glassmorphic e usa direttamente le variabili di tema
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
  const itemSpacing = 8;
  const getCardDimensions = () => {
    const containerHorizontalPadding = 8;
    const availableWidth = width - containerHorizontalPadding * 2;
    const totalSpaceBetweenColumns = itemSpacing * (numColumns - 1);
    const cardWidth = (availableWidth - totalSpaceBetweenColumns) / numColumns;
    const cardHeight = cardWidth * 1.4;
    return { width: cardWidth, height: cardHeight };
  };
  const cardDimensions = getCardDimensions();

  // Funzione per renderizzare un singolo item
  const renderItem = ({ item, index }: { item: PokemonCard | number; index: number }) => {
    const itemDelay = index * 50;
    const isSkeletonItem = typeof item === "number";
    return (
      <TouchableOpacity
        key={isSkeletonItem ? `skeleton-${index}` : item.id}
        style={{
          flex: 1,
          backgroundColor: "var(--color2)",
          borderRadius: 12,
          padding: 16,
          elevation: 3,
          width: cardDimensions.width,
          marginBottom: itemSpacing,
        }}
        onPress={isSkeletonItem ? undefined : () => onCardPress(item as PokemonCard)}
        disabled={isSkeletonItem}
      >
        {isSkeletonItem ? (
          <Animated.View style={{ opacity: 1 }}>
            <Skeleton variant="card" cardDimensions={cardDimensions} animationDelay={itemDelay} />
          </Animated.View>
        ) : (
          <CardItem card={item as PokemonCard} onPress={onCardPress} cardDimensions={cardDimensions} animationDelay={itemDelay} />
        )}
      </TouchableOpacity>
    );
  };

  const generateSkeletonData = () => {
    const skeletonCount = numColumns * 5;
    return Array.from({ length: skeletonCount }, (_, i) => i);
  };
  const skeletonData = generateSkeletonData();

  const ListFooterComponent = () => (
    <XStack style={{ justifyContent: "center", alignItems: "center", padding: 16 }}>
      {!isLoading && isLoadingMore && (
        <YStack style={{ padding: 12, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "var(--color3)", borderRadius: 12 }}>
          <Spinner size="small" color="var(--accent10)" />
          <Text color="var(--color)" fontSize={14}>Loading more cards...</Text>
        </YStack>
      )}
    </XStack>
  );

  const columnWrapperStyle: ViewStyle = {
    justifyContent: "space-between",
    gap: itemSpacing,
  };

  if (error) {
    return (
      <YStack flex={1} style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Card style={{ alignItems: "center", padding: 24, maxWidth: 320, width: "100%", backgroundColor: "var(--color2)", borderRadius: 12 }}>
          <Text fontSize={18} color="var(--red10)" fontWeight="bold" style={{ textAlign: "center", marginBottom: 8 }}>⚠️ Error</Text>
          <Text fontSize={14} color="var(--color)" style={{ textAlign: "center", marginBottom: 16, lineHeight: 20 }}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: "var(--red10)", borderRadius: 8, padding: 12, alignItems: "center", width: 120 }} onPress={onRefresh}>
            <Text color="#fff" fontSize={16} fontWeight="bold">Retry</Text>
          </TouchableOpacity>
        </Card>
      </YStack>
    );
  }

  if (!isLoading && cards.length === 0) {
    return (
      <YStack flex={1} style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Card style={{ alignItems: "center", padding: 32, maxWidth: 320, width: "100%", backgroundColor: "var(--color2)", borderRadius: 12 }}>
          <Text fontSize={48} style={{ marginBottom: 16, opacity: 0.6 }}>📦</Text>
          <Text fontSize={18} color="var(--color)" fontWeight="bold" style={{ textAlign: "center", marginBottom: 8 }}>No cards found</Text>
          <Text fontSize={14} color="var(--color2)" style={{ textAlign: "center", lineHeight: 20 }}>Try adjusting your search or filters</Text>
        </Card>
      </YStack>
    );
  }

  const listData = isLoading ? skeletonData : cards;

  return (
    <YStack flex={1}>
      <FlatList
        data={listData}
        numColumns={numColumns}
        key={`list-${numColumns}`}
        renderItem={renderItem}
        keyExtractor={(item, index) => isLoading ? `skeleton-${index}` : `${(item as PokemonCard).id}-${index}`}
        contentContainerStyle={{ padding: itemSpacing }}
        columnWrapperStyle={columnWrapperStyle}
        onRefresh={onRefresh}
        refreshing={isLoading}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooterComponent}
        scrollEnabled={!isLoading}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={numColumns * 3}
        windowSize={numColumns * 5}
      />
    </YStack>
  );
};
