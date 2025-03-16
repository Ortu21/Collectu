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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { fetchPokemonCards, searchPokemonCards } from "../services/api";
import { PokemonCard } from "../types/pokemon";

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

  // Primo useEffect solo per impostare isInitialized
  useEffect(() => {
    setIsInitialized(true);
  }, []);

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
  }, [searchQuery]);

  const loadPokemonCards = async (page: number, isNewSearch: boolean = false) => {
    if (isNewSearch) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      let result;
      if (searchQuery.trim() !== "") {
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
        setCards(prevCards => [...prevCards, ...result.data]);
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
            <TextInput
              style={styles.searchInput}
              placeholder="Search cards..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {totalCount > 0 && !isLoading && (
              <Text style={styles.resultCount}>
                Found {totalCount} card{totalCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading cards...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : cards.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Pokemon cards found</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
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
  searchInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  resultCount: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
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
