import React from "react";
import { useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  YStack,
  useTheme
} from "tamagui";
import { useAuth } from "../../hooks/useAuth";
import { PokemonCard } from "../../types/pokemon";
import { usePokemonCards } from "../../hooks/usePokemonCards";
import { usePokemonSets } from "../../hooks/usePokemonSets";
import { CardList } from "../../components/collectibles/CardList";
import { SearchFilterBar } from "../../components/collectibles/SearchFilterBar";
import { SetFilterModal } from "../../components/collectibles/SetFilterModal";

const CollectiblesScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const theme = useTheme();

  // Colori dinamici dal tema Tamagui
  const bg1 = theme.background?.val || '#0a0a0f';
  const bg2 = theme.color6?.val || '#1a1a2e';
  const bg3 = theme.color8?.val || '#16213e';
  const accent1 = theme.accent5?.val || 'rgba(255, 107, 203, 0.15)';
  const accent2 = theme.green5?.val || 'rgba(76, 175, 80, 0.15)';
  const accent3 = theme.yellow5?.val || 'rgba(255, 168, 0, 0.1)';

  const getNumColumns = () => {
    if (width >= 2000) return 6;
    if (width >= 1700) return 5;
    if (width >= 1200) return 4;
    if (width >= 900) return 3;
    return 2;
  };

  const numColumns = getNumColumns();

  const {
    cards,
    isLoading,
    isLoadingMore,
    error,
    searchQuery,
    setSearchQuery,
    totalCount,
    selectedSet,
    handleSetSelect,
    clearSetFilter,
    handleLoadMore,
    handleRefresh
  } = usePokemonCards({
    initialPageSize: 100,
    user
  });

  const {
    sets,
    isLoadingSets,
    isSetModalVisible,
    setIsSetModalVisible
  } = usePokemonSets({
    user
  });

  const handleCardPress = (card: PokemonCard) => {
    router.push(`/card/${card.id}`);
  };

  return (
    <YStack 
      flex={1} 
      backgroundColor={bg1}
      style={{
        background: `linear-gradient(135deg, ${bg1} 0%, ${bg2} 50%, ${bg3} 100%)`
      }}
    >
      <YStack
        fullscreen
        opacity={0.3}
        zIndex={-1}
        style={{
          background: `radial-gradient(circle at 20% 30%, ${accent1} 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${accent2} 0%, transparent 50%), radial-gradient(circle at 50% 50%, ${accent3} 0%, transparent 60%)`
        }}
      />
      
      <StatusBar style="light" />
      
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={() => setIsSetModalVisible(true)}
        selectedSet={selectedSet}
        onClearFilter={clearSetFilter}
        totalCount={totalCount}
        isLoading={isLoading}
      />
      
      <SetFilterModal
        isVisible={isSetModalVisible}
        onClose={() => setIsSetModalVisible(false)}
        sets={sets}
        isLoading={isLoadingSets}
        onSelectSet={handleSetSelect}
      />
      
      <CardList
        cards={cards}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        totalCount={totalCount}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onCardPress={handleCardPress}
        numColumns={numColumns}
      />
    </YStack>
  );
};

export default CollectiblesScreen;