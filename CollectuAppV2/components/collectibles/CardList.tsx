import React from "react";
import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  ViewStyle,
} from "react-native";
import { YStack, XStack, Text, Card, Spinner } from "tamagui";
import { PokemonCard } from "../../types/pokemon"; // Adjust path if necessary
import { CardItem } from "./CardItem";
import { Skeleton } from "./Skeleton";

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

  const renderItem = ({ item, index }: { item: PokemonCard | number; index: number }) => {
    const itemDelay = index * 50;
    const isSkeletonItem = typeof item === "number";
    return (
      <TouchableOpacity
        key={isSkeletonItem ? `skeleton-${index}` : (item as PokemonCard).id}
        style={{
          flex: 1,
          backgroundColor: "$backgroundPress", // Example: Using a theme variable
          borderRadius: 12,
          padding: 16,
          // elevation: 3, // Consider using Tamagui's shadow props if needed
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
    <XStack justifyContent="center" alignItems="center" padding={16}>
      {!isLoading && isLoadingMore && (
        <YStack padding={12} flexDirection="row" alignItems="center" gap={8} backgroundColor="$backgroundFocus" borderRadius={12}>
          <Spinner size="small" color="$accentColor10" />
          <Text color="$color" fontSize={14}>Loading more cards...</Text>
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
      <YStack flex={1} justifyContent="center" alignItems="center" padding={20}>
        <Card alignItems="center" padding={24} maxWidth={320} width="100%" backgroundColor="$backgroundStrong" borderRadius={12}>
          <Text fontSize={18} color="$red10" fontWeight="bold" textAlign="center" marginBottom={8}>⚠️ Error</Text>
          <Text fontSize={14} color="$color" textAlign="center" marginBottom={16} lineHeight={20}>{error}</Text>
          <TouchableOpacity style={{ backgroundColor: "$red10", borderRadius: 8, padding: 12, alignItems: "center", width: 120 }} onPress={onRefresh}>
            <Text color="$colorInverse" fontSize={16} fontWeight="bold">Retry</Text>
          </TouchableOpacity>
        </Card>
      </YStack>
    );
  }

  if (!isLoading && cards.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding={20}>
        <Card alignItems="center" padding={32} maxWidth={320} width="100%" backgroundColor="$backgroundStrong" borderRadius={12}>
          <Text fontSize={48} marginBottom={16} opacity={0.6}>📦</Text>
          <Text fontSize={18} color="$color" fontWeight="bold" textAlign="center" marginBottom={8}>No cards found</Text>
          <Text fontSize={14} color="$colorFocus" textAlign="center" lineHeight={20}>Try adjusting your search or filters</Text>
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