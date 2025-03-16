import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Modal,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { fetchPokemonCards, searchPokemonCards, fetchPokemonSets, fetchPokemonCardsBySet } from "../services/api";
import { PokemonCard, PokemonSet } from "../types/pokemon";

export default function PokemonCards() {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMoreCards, setHasMoreCards] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const pageSize = 20;
  
  // Set filter state
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<PokemonSet | null>(null);
  const [isSetModalVisible, setIsSetModalVisible] = useState(false);
  const [isLoadingSets, setIsLoadingSets] = useState(false);

  // Primo useEffect solo per impostare isInitialized
  useEffect(() => {
    setIsInitialized(true);
  }, []);
  
  // Carica i set Pokemon
  useEffect(() => {
    if (isInitialized && user) {
      loadPokemonSets();
    }
  }, [isInitialized, user]);
  
  const loadPokemonSets = async () => {
    setIsLoadingSets(true);
    try {
      const setsData = await fetchPokemonSets();
      setSets(setsData);
    } catch (err) {
      console.error("Error loading Pokemon sets:", err);
    } finally {
      setIsLoadingSets(false);
    }
  };

  // Secondo useEffect per la navigazione, ma solo dopo l'inizializzazione
  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      // Usa setTimeout per ritardare la navigazione
      const timer = setTimeout(() => {
        router.replace("/login");
      }, 0);

      return () => clearTimeout(timer);
    } else {
      loadPokemonCards(1, true);
    }
  }, [user, router, isInitialized]);

  // Effetto per gestire la ricerca con debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (isInitialized && user) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, isInitialized, user]);

  const handleSearch = useCallback(() => {
    // Reset dello stato e caricamento delle carte filtrate
    setCurrentPage(1);
    setCards([]);
    setHasMoreCards(true);
    loadPokemonCards(1, true);
  }, [searchQuery, selectedSet]);
  
  const handleSetSelect = (set: PokemonSet) => {
    setSelectedSet(set);
    setIsSetModalVisible(false);
    setSearchQuery(""); // Reset search query when selecting a set
    setCurrentPage(1);
    setCards([]);
    setHasMoreCards(true);
    loadPokemonCards(1, true);
  };
  
  const clearSetFilter = () => {
    setSelectedSet(null);
    setCurrentPage(1);
    setCards([]);
    setHasMoreCards(true);
    loadPokemonCards(1, true);
  };

  const loadPokemonCards = async (
    page: number,
    isNewSearch: boolean = false
  ) => {
    if (isNewSearch) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      let result;
      if (selectedSet) {
        // Filtra per set
        result = await fetchPokemonCardsBySet(selectedSet.setId, pageSize, page);
      } else if (searchQuery.trim() !== "") {
        // Usa la ricerca avanzata
        result = await searchPokemonCards(searchQuery, pageSize, page);
      } else {
        // Carica tutte le carte
        result = await fetchPokemonCards(pageSize, page);
      }

      setTotalCount(result.totalCount);

      if (isNewSearch) {
        setCards(result.data);
      } else {
        setCards((prevCards) => [...prevCards, ...result.data]);
      }

      // Verifica se ci sono altre carte da caricare
      setHasMoreCards(page * pageSize < result.totalCount);
      setCurrentPage(page);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch Pokemon cards"
      );
      console.error("Error fetching Pokemon cards:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreCards) {
      loadPokemonCards(currentPage + 1);
    }
  };

  const renderCard = ({ item }: { item: PokemonCard }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.cardImage}
        resizeMode="contain"
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardType}>{item.supertype}</Text>
        {item.rarity && (
          <Text style={styles.cardRarity}>Rarity: {item.rarity}</Text>
        )}
        {item.setName && (
          <Text style={styles.cardSet}>Set: {item.setName}</Text>
        )}
        {item.number && (
          <Text style={styles.cardNumber}>Number: {item.number}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const handleCardPress = (card: PokemonCard) => {
    // Future implementation: Navigate to card detail view
    console.log("Card pressed:", card.id);
  };

  const handleRefresh = () => {
    loadPokemonCards(1, true);
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Loading more cards...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!user ? null : (
        <>
          <StatusBar style="light" />
          <View style={styles.header}>
            <Text style={styles.title}>Pokemon Cards</Text>
            
            <View style={styles.filterContainer}>
              <TextInput
                style={[styles.searchInput, { flex: 1 }]}
                placeholder="Search cards..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setIsSetModalVisible(true)}
              >
                <Text style={styles.filterButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
            
            {selectedSet && (
              <View style={styles.selectedSetContainer}>
                <View style={styles.selectedSetInfo}>
                  <Image 
                    source={{ uri: selectedSet.logoUrl }} 
                    style={styles.selectedSetLogo} 
                    resizeMode="contain"
                  />
                  <Text style={styles.selectedSetName}>{selectedSet.setName}</Text>
                </View>
                <TouchableOpacity onPress={clearSetFilter} style={styles.clearFilterButton}>
                  <Text style={styles.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {totalCount > 0 && !isLoading && (
              <Text style={styles.resultCount}>
                Found {totalCount} card{totalCount !== 1 ? "s" : ""}
              </Text>
            )}
          </View>
          
          {/* Set Filter Modal */}
          <Modal
            visible={isSetModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsSetModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select a Set</Text>
                  <TouchableOpacity onPress={() => setIsSetModalVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                {isLoadingSets ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading sets...</Text>
                  </View>
                ) : (
                  <ScrollView style={styles.setsList}>
                    {sets.map((set) => (
                      <TouchableOpacity 
                        key={set.setId} 
                        style={styles.setItem}
                        onPress={() => handleSetSelect(set)}
                      >
                        <Image 
                          source={{ uri: set.logoUrl }} 
                          style={styles.setLogo} 
                          resizeMode="contain"
                        />
                        <View style={styles.setInfo}>
                          <Text style={styles.setName}>{set.setName}</Text>
                          <Text style={styles.setSeries}>{set.series}</Text>
                          <Text style={styles.setDate}>{set.releaseDate}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading cards...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : cards.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Pokemon cards found</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={cards}
              renderItem={renderCard}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              contentContainerStyle={styles.cardList}
              numColumns={2}
              onRefresh={handleRefresh}
              refreshing={isLoading}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={renderFooter}
            />
          )}
        </>
      )}
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
