import React from "react";
import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  ViewStyle,
} from "react-native";
import { YStack, XStack, Text, Card, Spinner, useTheme } from "tamagui";
import { PokemonCard } from "../../types/pokemon";
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
  const theme = useTheme();
  const itemSpacing = 32; // spacing aumentato per più aria tra le card

  const getCardDimensions = () => {
    // Calculate available width considering padding and gaps
    const availableWidth = width - (numColumns + 1) * itemSpacing;
    const cardWidth = availableWidth / numColumns;
    const cardHeight = cardWidth * 1.4; // Maintain aspect ratio
    return { width: cardWidth, height: cardHeight };
  };
  const cardDimensions = getCardDimensions();

  const renderItem = ({ item, index }: { item: PokemonCard | number; index: number }) => {
    const itemDelay = index * 50;
    const isSkeletonItem = typeof item === "number";
    return (
      <YStack
        key={isSkeletonItem ? `skeleton-${index}` : (item as PokemonCard).id}
        width={cardDimensions.width}
        marginBottom={itemSpacing}
        borderRadius={12}
        backgroundColor={theme.$backgroundTransparent?.val}
      >
        {isSkeletonItem ? (
          <Animated.View style={{ opacity: 1 }}>
            <Skeleton variant="card" cardDimensions={cardDimensions} animationDelay={itemDelay} />
          </Animated.View>
        ) : (
          <CardItem 
            card={item as PokemonCard} 
            onPress={onCardPress} 
            cardDimensions={cardDimensions} 
            animationDelay={itemDelay}
            theme={theme}
          />
        )}
      </YStack>
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
        <YStack padding={12} flexDirection="row" alignItems="center" gap={8} backgroundColor={theme.background?.val} borderRadius={12}>
          <Spinner size="small" color={theme.color?.val} />
          <Text color={theme.color?.val} fontSize={14}>Loading more cards...</Text>
        </YStack>
      )}
    </XStack>
  );
  

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding={20}>
        <Card alignItems="center" padding={24} maxWidth={320} width="100%" backgroundColor={theme.background?.val} borderRadius={12}>
          <Text fontSize={18} color={theme.red10?.val} fontWeight="bold" textAlign="center" marginBottom={8}>⚠️ Error</Text>
          <Text fontSize={14} color={theme.color?.val} textAlign="center" marginBottom={16} lineHeight={20}>{error}</Text>
          <Card
            backgroundColor={theme.red10?.val}
            borderRadius={8}
            padding={0}
            alignItems="center"
            width={120}
            pressStyle={{ opacity: 0.8 }}
            onPress={onRefresh}
            asChild
          >
            <TouchableOpacity style={{ width: '100%', padding: 12, alignItems: 'center', borderRadius: 8 }}>
              <Text color={theme.color?.val} fontSize={16} fontWeight="bold">Retry</Text>
            </TouchableOpacity>
          </Card>
        </Card>
      </YStack>
    );
  }

  if (!isLoading && cards.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding={20}>
        <Card alignItems="center" padding={32} maxWidth={320} width="100%" backgroundColor={theme.background?.val} borderRadius={12}>
          <Text fontSize={48} marginBottom={16} opacity={0.6}>📦</Text>
          <Text fontSize={18} color={theme.color?.val} fontWeight="bold" textAlign="center" marginBottom={8}>No cards found</Text>
          <Text fontSize={14} color={theme.color?.val} textAlign="center" lineHeight={20}>Try adjusting your search or filters</Text>
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
        contentContainerStyle={{ paddingVertical: itemSpacing, paddingHorizontal: itemSpacing }}
        columnWrapperStyle={{
          paddingHorizontal: 0, // padding già su contentContainerStyle
          justifyContent: "space-between",
          gap: itemSpacing,
          alignItems: "flex-start",
        }}
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
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
};