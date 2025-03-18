import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, SafeAreaView, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { PokemonCard } from "../types/pokemon";
import { usePokemonCards } from "../hooks/usePokemonCards";
import { usePokemonSets } from "../hooks/usePokemonSets";
import { PokemonCardList } from "../components/pokemon/PokemonCardList";
import { SearchFilterBar } from "../components/pokemon/SearchFilterBar";
import { SetFilterModal } from "../components/pokemon/SetFilterModal";

export default function PokemonCards() {
  const { user } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize the app
  useEffect(() => {
    setIsInitialized(true);
  }, []);
  
  // Handle authentication redirect
  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [user, router, isInitialized]);
  
  // Use custom hooks for Pokemon cards and sets
  const {
    cards,
    isLoading,
    isLoadingMore,
    error,
    searchQuery,
    setSearchQuery,
    totalCount,
    hasMoreCards,
    selectedSet,
    handleSetSelect,
    clearSetFilter,
    handleLoadMore,
    handleRefresh
  } = usePokemonCards({
    initialPageSize: 20,
    user,
    isInitialized
  });
  
  const {
    sets,
    isLoadingSets,
    isSetModalVisible,
    setIsSetModalVisible
  } = usePokemonSets({
    user,
    isInitialized
  });
  
  const handleCardPress = (card: PokemonCard) => {
    // Future implementation: Navigate to card detail view
    console.log("Card pressed:", card.id);
  };
  
  // If user is not authenticated, don't render anything
  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
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
      
      <PokemonCardList
        cards={cards}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        totalCount={totalCount}
        onRefresh={handleRefresh}
        onLoadMore={handleLoadMore}
        onCardPress={handleCardPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingTop: RNStatusBar.currentHeight,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedSetContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  selectedSetInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedSetLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  selectedSetName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  clearFilterButton: {
    backgroundColor: "#444",
    borderRadius: 4,
    padding: 6,
  },
  clearFilterText: {
    color: "#fff",
    fontSize: 12,
  },
  resultCount: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#25292e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    fontSize: 20,
    color: "#fff",
    padding: 5,
  },
  setsList: {
    flex: 1,
  },
  setItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  setLogo: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  setInfo: {
    flex: 1,
  },
  setName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  setSeries: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 2,
  },
  setDate: {
    color: "#777",
    fontSize: 12,
  },
  cardList: {
    padding: 8,
  },
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
