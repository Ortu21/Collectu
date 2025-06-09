import React from "react";
import { useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  YStack,
  Theme,
  useTheme // Import useTheme to access theme variables
} from "tamagui";
import { useAuth } from "../../hooks/useAuth"; // Adjusted path
import { PokemonCard } from "../../types/pokemon"; // Adjusted path
import { usePokemonCards } from "../../hooks/usePokemonCards"; // Adjusted path
import { usePokemonSets } from "../../hooks/usePokemonSets"; // Adjusted path
import { CardList } from "../../components/collectibles/CardList"; // Adjusted path
import { SearchFilterBar } from "../../components/collectibles/SearchFilterBar"; // Adjusted path
import { SetFilterModal } from "../../components/collectibles/SetFilterModal"; // Adjusted path

const CollectiblesScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const theme = useTheme(); // Get theme object

  // Determine number of columns based on screen width
  const getNumColumns = () => {
    if (width >= 1200) return 5;
    if (width >= 900) return 4;
    if (width >= 600) return 3;
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
    // Assuming you have a route like /card/[id].tsx or similar in CollectuAppV2
    router.push(`/card/${card.id}`);
  };

  return (
    <Theme name="dark">
      <YStack 
        flex={1} 
        // Use theme variable for background, keep gradient for now
        backgroundColor={theme.background?.val || "#0a0a0f"} 
        style={{
          // The complex gradient might be better as a custom component or a specific theme token if used often
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)", 
        }}
      >
        {/* Decorative background with blur - kept as inline style for now */}
        <YStack
          fullscreen
          opacity={0.3}
          zIndex={-1} // Ensure it's behind content
          style={{
            background: "radial-gradient(circle at 20% 30%, rgba(255, 107, 203, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(76, 175, 80, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(255, 168, 0, 0.1) 0%, transparent 60%)",
          }}
        />
        
        <StatusBar style="light" /> {/* Changed to light for dark theme based on common practice */}
        
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
    </Theme>
  );
};

export default CollectiblesScreen;