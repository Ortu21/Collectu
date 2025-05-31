import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { fetchPokemonCardById } from "../../../services/api";
import { PokemonCard } from "../../../types/pokemon";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { PriceSection } from "../../../components/collectibles/PriceSection";
import { CardAction } from "../../../components/collectibles/CardAction";

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [card, setCard] = useState<PokemonCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();

  // Shared values for animations
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.9);
  const detailsOpacity = useSharedValue(0);

  // Animated styles for card image
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ scale: cardScale.value }],
    };
  });

  // Animated styles for details container
  const detailsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: detailsOpacity.value,
    };
  });

  // Function to trigger animations when card loads
  const triggerAnimations = () => {
    // Reset animation values when loading a new card
    cardOpacity.value = 0;
    cardScale.value = 0.9;
    detailsOpacity.value = 0;

    // Animate card with spring effect
    setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 600 });
      cardScale.value = withSpring(1, { damping: 15, stiffness: 100 });

      // Animate details with a delay
      setTimeout(() => {
        detailsOpacity.value = withTiming(1, { duration: 500 });
      }, 300);
    }, 100);
  };

  // Determine if we should use desktop layout
  const isDesktopLayout = width >= 768;

  // Calculate optimal card dimensions based on screen size
  const getCardDimensions = () => {
    // Card aspect ratio is approximately 1:1.4 (width:height)
    const cardAspectRatio = 1.4;

    if (isDesktopLayout) {
      // For desktop, use 40% of the screen width (matching the desktopImageContainer width)
      const containerWidth = width * 0.4 - 40; // 40% of screen width minus padding
      const cardWidth = Math.min(containerWidth, 500); // Cap at 500px max width
      const cardHeight = cardWidth * cardAspectRatio;

      return {
        width: cardWidth,
        height: cardHeight,
      };
    } else {
      // For mobile, use 90% of the screen width
      const containerWidth = width * 0.9;
      const cardWidth = Math.min(containerWidth, 400); // Cap at 400px max width
      const cardHeight = cardWidth * cardAspectRatio;

      return {
        width: cardWidth,
        height: cardHeight,
      };
    }
  };

  // Get the optimal card dimensions
  const cardDimensions = getCardDimensions();

  useEffect(() => {
    const loadCard = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const cardData = await fetchPokemonCardById(id);
        console.log("Card data received:", JSON.stringify(cardData, null, 2));
        console.log("Price data available:", {
          cardMarket: !!cardData.cardMarketPrices,
          tcgPlayer: !!cardData.tcgPlayerPrices,
        });
        setCard(cardData);
        setError(null);
      } catch (err) {
        console.error("Error loading card:", err);
        setError("Failed to load card details");
      } finally {
        setIsLoading(false);
        // Trigger animations when card is loaded
        triggerAnimations();
      }
    };

    loadCard();
  }, [id]);

  // Create animated components for better platform compatibility
  const AnimatedView =
    Platform.OS === "web"
      ? Animated.createAnimatedComponent(View)
      : Animated.View;
  const AnimatedImage = Animated.createAnimatedComponent(Image);

  const handleGoBack = () => {
    router.push("collectibles");
  };

  // Handler for add/remove actions (for now just log)
  const handleAddCard = (qty: number, quality: string) => {
    // TODO: implement backend call
    console.log(`Aggiungi ${qty} carta/e (${quality})`);
  };
  const handleRemoveCard = (qty: number, quality: string) => {
    // TODO: implement backend call
    console.log(`Rimuovi ${qty} carta/e (${quality})`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading card details...</Text>
      </View>
    );
  }

  if (error || !card) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Card not found"}</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Helper function to format price
  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null) return "N/A";
    return `$${price.toFixed(2)}`;
  };

  // Function to render energy cost icons
  const renderEnergyCost = (cost: string) => {
    const energyTypes = cost.split(",").map((type) => type.trim());
    return (
      <View style={styles.energyContainer}>
        {energyTypes.map((type, index) => {
          let iconName = "circle";
          let color = "#777";

          // Map energy types to colors
          switch (type.toLowerCase()) {
            case "colorless":
              color = "#A8A8A8";
              break;
            case "darkness":
              color = "#735A4A";
              break;
            case "dragon":
              color = "#7038F8";
              break;
            case "fairy":
              color = "#EE99AC";
              break;
            case "fighting":
              color = "#C03028";
              break;
            case "fire":
              color = "#F08030";
              break;
            case "grass":
              color = "#78C850";
              break;
            case "lightning":
              color = "#F8D030";
              break;
            case "metal":
              color = "#B8B8D0";
              break;
            case "psychic":
              color = "#F85888";
              break;
            case "water":
              color = "#6890F0";
              break;
          }

          return (
            <View
              key={`${type}-${index}`}
              style={[styles.energyIcon, { backgroundColor: color }]}
            >
              <Text style={styles.energyText}>{type.charAt(0)}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      {/* Header with back button and card name */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{card.name}</Text>
        {card.hp && (
          <View style={styles.hpContainer}>
            <Text style={styles.hpText}>HP {card.hp}</Text>
          </View>
        )}
      </View>

      {isDesktopLayout ? (
        <View style={styles.desktopContainer}>
          {/* Sezione superiore: immagine a sinistra, info brevi a destra */}
          <View style={styles.desktopTopRow}>
            <AnimatedView style={[styles.desktopImageContainer, cardAnimatedStyle]}>
              <View style={styles.cardImageWrapper}>
                <AnimatedImage
                  source={{ uri: card.largeImageUrl }}
                  style={[
                    styles.cardImage,
                    {
                      width: cardDimensions.width,
                      height: cardDimensions.height,
                    },
                  ]}
                  resizeMode="contain"
                />
              </View>
            </AnimatedView>
            <View style={styles.desktopShortInfoContainer}>
              <View style={styles.cardInfoSection}>
                <Text style={styles.sectionTitle}>Card Information</Text>
                <View style={styles.cardInfo}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <Ionicons name="albums-outline" size={18} color="#aaa" style={styles.infoIcon} />
                      <Text style={styles.infoLabel}>Set:</Text>
                    </View>
                    <Text style={styles.infoValue}>{card.setName || "Unknown"}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <Ionicons name="pricetag-outline" size={18} color="#aaa" style={styles.infoIcon} />
                      <Text style={styles.infoLabel}>Number:</Text>
                    </View>
                    <Text style={styles.infoValue}>{card.number || "Unknown"}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <Ionicons name="star-outline" size={18} color="#aaa" style={styles.infoIcon} />
                      <Text style={styles.infoLabel}>Rarity:</Text>
                    </View>
                    <Text style={styles.infoValue}>{card.rarity || "Unknown"}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={styles.infoLabelContainer}>
                      <MaterialCommunityIcons name="cards" size={18} color="#aaa" style={styles.infoIcon} />
                      <Text style={styles.infoLabel}>Type:</Text>
                    </View>
                    <Text style={styles.infoValue}>{card.supertype || "Unknown"}</Text>
                  </View>
                  {card.evolvesFrom && (
                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <MaterialCommunityIcons name="arrow-up-bold" size={18} color="#aaa" style={styles.infoIcon} />
                        <Text style={styles.infoLabel}>Evolves From:</Text>
                      </View>
                      <Text style={styles.infoValue}>{card.evolvesFrom}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          {/* Sezione inferiore: tutte le sezioni lunghe a tutta larghezza */}
          <View style={styles.desktopBottomRow}>
            {(card.cardMarketPrices || card.tcgPlayerPrices) && (
              <View style={styles.cardInfoSection}>
                <Text style={styles.sectionTitle}>Prices</Text>
                {card.cardMarketPrices && (
                  <PriceSection 
                    prices={card.cardMarketPrices} 
                    title="CardMarket" 
                    formatPrice={formatPrice} 
                  />
                )}
                {card.tcgPlayerPrices && (
                  <PriceSection 
                    prices={card.tcgPlayerPrices} 
                    title="TCGPlayer" 
                    formatPrice={formatPrice} 
                  />
                )}
                {!card.cardMarketPrices && !card.tcgPlayerPrices && (
                  <Text style={styles.noDataText}>No price data available</Text>
                )}
              </View>
            )}
            {card.attacks && card.attacks.length > 0 && (
              <View style={styles.cardInfoSection}>
                <Text style={styles.sectionTitle}>Attacks</Text>
                {card.attacks.map((attack, index) => (
                  <View key={`attack-${index}`} style={styles.attackContainer}>
                    <View style={styles.attackHeader}>
                      <View style={styles.attackNameContainer}>
                        {renderEnergyCost(attack.cost)}
                        <Text style={styles.attackName}>{attack.name}</Text>
                      </View>
                      {attack.damage && (
                        <Text style={styles.attackDamage}>{attack.damage}</Text>
                      )}
                    </View>
                    <Text style={styles.attackText}>{attack.text}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.cardInfoSection}>
              <Text style={styles.sectionTitle}>Battle Attributes</Text>
              <View style={styles.battleAttributesContainer}>
                <View style={styles.attributeSection}>
                  <Text style={styles.attributeTitle}>Weaknesses</Text>
                  {card.weaknesses && card.weaknesses.length > 0 ? (
                    <View style={styles.attributeList}>
                      {card.weaknesses.map((weakness, index) => (
                        <View key={`weakness-${index}`} style={styles.attributeItem}>
                          <Text style={[styles.attributeType, { color: getTypeColor(weakness.type) }]}>{weakness.type}</Text>
                          <Text style={styles.attributeValue}>{weakness.value}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noDataText}>None</Text>
                  )}
                </View>
                <View style={styles.attributeSection}>
                  <Text style={styles.attributeTitle}>Resistances</Text>
                  {card.resistances && card.resistances.length > 0 ? (
                    <View style={styles.attributeList}>
                      {card.resistances.map((resistance, index) => (
                        <View key={`resistance-${index}`} style={styles.attributeItem}>
                          <Text style={[styles.attributeType, { color: getTypeColor(resistance.type) }]}>{resistance.type}</Text>
                          <Text style={styles.attributeValue}>{resistance.value}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noDataText}>None</Text>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.cardInfoSection}>
              <CardAction onAdd={handleAddCard} onRemove={handleRemoveCard} />
            </View>
          </View>
        </View>
      ) : (
        /* Mobile layout - Original vertical layout */
        <>
          {/* Card image with shadow effect */}
          <AnimatedView style={[styles.cardImageContainer, cardAnimatedStyle]}>
            <View style={styles.cardImageWrapper}>
              <AnimatedImage
                source={{ uri: card.largeImageUrl }}
                style={[
                  styles.cardImage,
                  {
                    width: cardDimensions.width,
                    height: cardDimensions.height,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          </AnimatedView>

          {/* Basic card information - Mobile */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.cardInfoSection}
          >
            <Text style={styles.sectionTitle}>Card Information</Text>
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons
                    name="albums-outline"
                    size={18}
                    color="#aaa"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Set:</Text>
                </View>
                <Text style={styles.infoValue}>
                  {card.setName || "Unknown"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons
                    name="pricetag-outline"
                    size={18}
                    color="#aaa"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Number:</Text>
                </View>
                <Text style={styles.infoValue}>{card.number || "Unknown"}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <Ionicons
                    name="star-outline"
                    size={18}
                    color="#aaa"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Rarity:</Text>
                </View>
                <Text style={styles.infoValue}>{card.rarity || "Unknown"}</Text>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <MaterialCommunityIcons
                    name="cards"
                    size={18}
                    color="#aaa"
                    style={styles.infoIcon}
                  />
                  <Text style={styles.infoLabel}>Type:</Text>
                </View>
                <Text style={styles.infoValue}>
                  {card.supertype || "Unknown"}
                </Text>
              </View>

              {card.evolvesFrom && (
                <View style={styles.infoRow}>
                  <View style={styles.infoLabelContainer}>
                    <MaterialCommunityIcons
                      name="arrow-up-bold"
                      size={18}
                      color="#aaa"
                      style={styles.infoIcon}
                    />
                    <Text style={styles.infoLabel}>Evolves From:</Text>
                  </View>
                  <Text style={styles.infoValue}>{card.evolvesFrom}</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Market Prices Section - Mobile */}
          {(card.cardMarketPrices || card.tcgPlayerPrices) && (
            <Animated.View
              entering={FadeInDown.delay(400).duration(500)}
              style={styles.cardInfoSection}
            >
              <Text style={styles.sectionTitle}>Prices</Text>

              {/* CardMarket Prices */}
              {card.cardMarketPrices && (
                <PriceSection
                  prices={card.cardMarketPrices}
                  title="CardMarket"
                  formatPrice={formatPrice}
                />
              )}

              {/* TCGPlayer Prices */}
              {card.tcgPlayerPrices && (
                <PriceSection
                  prices={card.tcgPlayerPrices}
                  title="TCGPlayer"
                  formatPrice={formatPrice}
                />
              )}

              {!card.cardMarketPrices && !card.tcgPlayerPrices && (
                <Text style={styles.noDataText}>No price data available</Text>
              )}
            </Animated.View>
          )}

          {/* Attacks section - Mobile */}
          {card.attacks && card.attacks.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(500).duration(500)}
              style={styles.cardInfoSection}
            >
              <Text style={styles.sectionTitle}>Attacks</Text>
              {card.attacks.map((attack, index) => (
                <View key={`attack-${index}`} style={styles.attackContainer}>
                  <View style={styles.attackHeader}>
                    <View style={styles.attackNameContainer}>
                      {renderEnergyCost(attack.cost)}
                      <Text style={styles.attackName}>{attack.name}</Text>
                    </View>
                    {attack.damage && (
                      <Text style={styles.attackDamage}>{attack.damage}</Text>
                    )}
                  </View>
                  <Text style={styles.attackText}>{attack.text}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Battle Attributes - Mobile */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(500)}
            style={styles.cardInfoSection}
          >
            <Text style={styles.sectionTitle}>Battle Attributes</Text>
            <View style={styles.battleAttributesContainer}>
              {/* Weaknesses */}
              <View style={styles.attributeSection}>
                <Text style={styles.attributeTitle}>Weaknesses</Text>
                {card.weaknesses && card.weaknesses.length > 0 ? (
                  <View style={styles.attributeList}>
                    {card.weaknesses.map((weakness, index) => (
                      <View
                        key={`weakness-${index}`}
                        style={styles.attributeItem}
                      >
                        <Text
                          style={[
                            styles.attributeType,
                            { color: getTypeColor(weakness.type) },
                          ]}
                        >
                          {weakness.type}
                        </Text>
                        <Text style={styles.attributeValue}>
                          {weakness.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>None</Text>
                )}
              </View>

              {/* Resistances */}
              <View style={styles.attributeSection}>
                <Text style={styles.attributeTitle}>Resistances</Text>
                {card.resistances && card.resistances.length > 0 ? (
                  <View style={styles.attributeList}>
                    {card.resistances.map((resistance, index) => (
                      <View
                        key={`resistance-${index}`}
                        style={styles.attributeItem}
                      >
                        <Text
                          style={[
                            styles.attributeType,
                            { color: getTypeColor(resistance.type) },
                          ]}
                        >
                          {resistance.type}
                        </Text>
                        <Text style={styles.attributeValue}>
                          {resistance.value}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>None</Text>
                )}
              </View>
            </View>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(700).duration(500)}>
            {/* --- CardAction component: Mobile layout --- */}
            <View style={{ marginHorizontal: 12 }}>
              <CardAction onAdd={handleAddCard} onRemove={handleRemoveCard} />
            </View>
          </Animated.View>
        </>
      )}
    </ScrollView>
  );
}

// Helper function to get color based on Pokemon type
const getTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "colorless":
      return "#A8A8A8";
    case "darkness":
      return "#735A4A";
    case "dragon":
      return "#7038F8";
    case "fairy":
      return "#EE99AC";
    case "fighting":
      return "#C03028";
    case "fire":
      return "#F08030";
    case "grass":
      return "#78C850";
    case "lightning":
      return "#F8D030";
    case "metal":
      return "#B8B8D0";
    case "psychic":
      return "#F85888";
    case "water":
      return "#6890F0";
    default:
      return "#777";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1d21",
  },
  desktopContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 24,
    gap: 0,
    minHeight: "100%",
  },
  desktopTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 24,
  },
  desktopImageContainer: {
    width: "40%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 24,
    backgroundColor: "rgba(37, 41, 46, 0.7)",
    borderRadius: 16,
  },
  desktopShortInfoContainer: {
    width: "60%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  desktopBottomRow: {
    flexDirection: "column",
    gap: 24,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1d21",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1d21",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(37, 41, 46, 0.7)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(51, 51, 51, 0.5)",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 16,
    flex: 1,
  },
  hpContainer: {
    backgroundColor: "rgba(231, 76, 60, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hpText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardImageContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(37, 41, 46, 0.7)",
    width: "100%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardImageWrapper: {
    backgroundColor: "rgba(51, 51, 51, 0.5)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  cardImage: {
    backgroundColor: "transparent",
    borderRadius: 12,
  },
  cardInfoSection: {
    marginVertical: 16,
    backgroundColor: "rgba(37, 41, 46, 0.7)",
    borderRadius: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "rgba(44, 62, 80, 0.8)",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardInfo: {
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 140,
    backgroundColor: "rgba(51, 51, 51, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: "#aaa",
  },
  infoValue: {
    fontSize: 15,
    color: "#fff",
    flex: 1,
    marginLeft: 12,
  },
  energyContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  energyIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    backgroundColor: "rgba(51, 51, 51, 0.5)",
  },
  energyText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  attackContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  attackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  attackNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  attackName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  attackDamage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    backgroundColor: "rgba(51, 51, 51, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  attackText: {
    fontSize: 15,
    color: "#ddd",
    marginTop: 8,
    lineHeight: 22,
  },
  battleAttributesContainer: {
    padding: 20,
    flexDirection: "row",
    gap: 24,
  },
  attributeSection: {
    flex: 1,
    backgroundColor: "rgba(51, 51, 51, 0.5)",
    padding: 16,
    borderRadius: 12,
  },
  attributeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  attributeList: {
    marginTop: 12,
  },
  attributeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(68, 68, 68, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
  attributeType: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 12,
  },
  attributeValue: {
    fontSize: 15,
    color: "#fff",
  },
  noDataText: {
    fontSize: 15,
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "center",
    padding: 16,
  },
  priceSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  priceSourceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  priceUpdated: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 16,
  },
  priceTable: {
    marginTop: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  priceDetailContainer: {
    marginBottom: 20,
  },
  foilTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 12,
  },
  priceItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(51, 51, 51, 0.5)",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 6,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ecc71",
  },
});
