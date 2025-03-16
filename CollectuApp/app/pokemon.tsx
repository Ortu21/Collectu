import React, { useState, useEffect } from "react";
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

type PokemonCard = {
  id: string;
  name: string;
  supertype: string;
  hp?: string;
  evolvesFrom: string;
  rarity: string;
  imageUrl: string;
};

export default function PokemonCards() {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPokemonCards();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter((card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCards(filtered);
    }
  }, [searchQuery, cards]);

  const fetchPokemonCards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("https://api.pokemontcg.io/v2/cards?pageSize=20");
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match our PokemonCard type
      const transformedCards: PokemonCard[] = data.data.map((card: any) => ({
        id: card.id,
        name: card.name,
        supertype: card.supertype || "",
        hp: card.hp || "",
        evolvesFrom: card.evolvesFrom || "",
        rarity: card.rarity || "",
        imageUrl: card.images.small || "",
      }));
      
      setCards(transformedCards);
      setFilteredCards(transformedCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Pokemon cards");
      console.error("Error fetching Pokemon cards:", err);
    } finally {
      setIsLoading(false);
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
        {item.rarity && <Text style={styles.cardRarity}>Rarity: {item.rarity}</Text>}
      </View>
    </TouchableOpacity>
  );

  const handleCardPress = (card: PokemonCard) => {
    // Future implementation: Navigate to card detail view
    console.log("Card pressed:", card.id);
  };

  const handleRefresh = () => {
    fetchPokemonCards();
  };

  if (!user) {
    // Redirect to login if not authenticated
    router.replace("/login");
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
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
      ) : filteredCards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Pokemon cards found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredCards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardList}
          numColumns={2}
          onRefresh={handleRefresh}
          refreshing={isLoading}
        />
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
});