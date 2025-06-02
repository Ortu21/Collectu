import React, { useEffect, useState } from "react";
import { ActivityIndicator, useWindowDimensions, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { fetchPokemonCardById } from "../../../services/api";
import { PokemonCard } from "../../../types/pokemon";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { PriceSection } from "../../../components/collectibles/PriceSection";
import { CardAction } from "../../../components/collectibles/CardAction";
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  Image,
  Theme,
  ScrollView,
  View,
} from "tamagui";
import {
  getPlatformGlassmorphicStyle,
  glassmorphicCardStyles,
  glassmorphicBarStyles,
  glassmorphicHeaderStyles,
  glassmorphicButtonStyles,
  glassmorphicImageContainerStyles,
  glassmorphicLoadingStyles,
  glassmorphicErrorCardStyles,
  glassmorphicCardHeaderStyles,
  glassmorphicSectionStyles,
} from "../../../styles/glassmorphicStyles";

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [card, setCard] = useState<PokemonCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.9);
  const detailsOpacity = useSharedValue(0);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));
  const detailsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: detailsOpacity.value,
  }));

  const triggerAnimations = () => {
    cardOpacity.value = 0;
    cardScale.value = 0.9;
    detailsOpacity.value = 0;
    setTimeout(() => {
      cardOpacity.value = withTiming(1, { duration: 600 });
      cardScale.value = withSpring(1, { damping: 15, stiffness: 100 });
      setTimeout(() => {
        detailsOpacity.value = withTiming(1, { duration: 500 });
      }, 300);
    }, 100);
  };

  const isDesktopLayout = width >= 768;
  const getCardDimensions = () => {
    const cardAspectRatio = 1.4;
    if (isDesktopLayout) {
      const containerWidth = width * 0.4 - 40;
      const cardWidth = Math.min(containerWidth, 500);
      const cardHeight = cardWidth * cardAspectRatio;
      return { width: cardWidth, height: cardHeight };
    } else {
      const containerWidth = width * 0.9;
      const cardWidth = Math.min(containerWidth, 400);
      const cardHeight = cardWidth * cardAspectRatio;
      return { width: cardWidth, height: cardHeight };
    }
  };
  const cardDimensions = getCardDimensions();

  useEffect(() => {
    const loadCard = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const cardData = await fetchPokemonCardById(id);
        setCard(cardData);
        setError(null);
      } catch (err) {
        setError("Failed to load card details");
      } finally {
        setIsLoading(false);
        triggerAnimations();
      }
    };
    loadCard();
  }, [id]);

  const AnimatedView =
    Platform.OS === "web"
      ? Animated.createAnimatedComponent(View)
      : Animated.View;
  const AnimatedImage = Animated.createAnimatedComponent(Image);

  const handleGoBack = () => router.push("collectibles");
  const handleAddCard = (qty: number, quality: string) => {};
  const handleRemoveCard = (qty: number, quality: string) => {};
  const formatPrice = (price: number | undefined | null) =>
    price == null ? "N/A" : `$${price.toFixed(2)}`;

  const renderEnergyCost = (cost: string) => {
    const energyTypes = cost.split(",").map((type) => type.trim());
    return (
      <XStack gap="$2">
        {energyTypes.map((type, index) => {
          let color = "#777";
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
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: color,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text color="#fff" fontSize="$2" fontWeight="bold">
                {type.charAt(0)}
              </Text>
            </View>
          );
        })}
      </XStack>
    );
  };

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

  if (isLoading) {
    return (
      <Theme name="dark">
        <YStack
          flex={1}
          justify="center"
          style={{
            backgroundColor: "#0a0a0f",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 70%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 70%)",
          }}
        >
          <Card
            elevate
            borderRadius={16}
            style={getPlatformGlassmorphicStyle(glassmorphicLoadingStyles)}
          >
            <YStack space={16} style={{ alignItems: "center" }}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={{ color: "rgba(255, 255, 255, 0.9)" }} fontSize={18}>
                Loading card details...
              </Text>
            </YStack>
          </Card>
        </YStack>
      </Theme>
    );
  }

  if (error || !card) {
    return (
      <Theme name="dark">
        <YStack
          flex={1}
          justify="center"
          style={{
            backgroundColor: "#0a0a0f",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 70%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 70%)",
          }}
        >
          <Card
            elevate
            borderRadius={16}
            style={getPlatformGlassmorphicStyle(glassmorphicErrorCardStyles)}
          >
            <YStack space={16} style={{ alignItems: "center" }}>
              <Text
                style={{ color: "#FF3B30", textAlign: "center", fontSize: 24 }}
              >
                {" "}
                {error || "Card not found"}{" "}
              </Text>
              <Button
                style={getPlatformGlassmorphicStyle(glassmorphicButtonStyles)}
                onPress={handleGoBack}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Go to Home
                </Text>
              </Button>
            </YStack>
          </Card>
        </YStack>
      </Theme>
    );
  }

  return (
    <Theme name="dark">
      <YStack
        flex={1}
        style={{
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 70%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 70%)",
        }}
      >
        <StatusBar style="light" />
        {/* Header */}
        <XStack
          style={[
            { alignItems: "center" },
            getPlatformGlassmorphicStyle(glassmorphicHeaderStyles),
          ]}
        >
          <Button
            size="$3"
            chromeless
            onPress={handleGoBack}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Button>
          <Text
            flex={1}
            fontSize={24}
            fontWeight="bold"
            style={{ color: "#fff", marginLeft: 16 }}
          >
            {card.name}
          </Text>
          {card.hp && (
            <Card
              style={{
                backgroundColor: "rgba(231, 76, 60, 0.8)",
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
                HP {card.hp}
              </Text>
            </Card>
          )}
        </XStack>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isDesktopLayout ? (
            <YStack space={24}>
              <XStack style={{ gap: 24, alignItems: "flex-start" }}>
                <AnimatedView style={[{ width: "40%" }, cardAnimatedStyle]}>
                  <Card
                    style={{
                      alignItems: "center",
                      padding: 24,
                      ...getPlatformGlassmorphicStyle(
                        glassmorphicImageContainerStyles
                      ),
                    }}
                  >
                    <Card
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 16,
                        padding: 8,
                      }}
                    >
                      <AnimatedImage
                        source={{ uri: card.largeImageUrl }}
                        style={{
                          width: cardDimensions.width,
                          height: cardDimensions.height,
                          borderRadius: 12,
                        }}
                        resizeMode="contain"
                      />
                    </Card>
                  </Card>
                </AnimatedView>
                <YStack flex={1}>
                  <Card
                    borderRadius={16}
                    style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}
                  >
                    <Text
                      fontSize={24}
                      fontWeight="bold"
                      style={{
                        color: "#fff",
                        backgroundColor: "rgba(44, 62, 80, 0.8)",
                        padding: 16,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    >
                      Card Information
                    </Text>
                    <YStack style={{ padding: 20 }} space={16}>
                      <XStack style={{ alignItems: "center", gap: 12 }}>
                        <Card
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            padding: 8,
                            borderRadius: 8,
                            width: 140,
                          }}
                        >
                          <XStack style={{ alignItems: "center", gap: 8 }}>
                            <Ionicons
                              name="albums-outline"
                              size={18}
                              color="#aaa"
                            />
                          </XStack>
                        </Card>
                        <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>
                          {card.setName || "Unknown"}
                        </Text>
                      </XStack>
                      <XStack style={{ alignItems: "center", gap: 12 }}>
                        <Card
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            padding: 8,
                            borderRadius: 8,
                            width: 140,
                          }}
                        >
                          <XStack style={{ alignItems: "center", gap: 8 }}>
                            <MaterialCommunityIcons
                              name="numeric"
                              size={18}
                              color="#aaa"
                            />
                          </XStack>
                        </Card>
                        <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>
                          {card.number || "-"}
                        </Text>
                      </XStack>
                      <XStack style={{ alignItems: "center", gap: 12 }}>
                        <Card
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            padding: 8,
                            borderRadius: 8,
                            width: 140,
                          }}
                        >
                          <XStack style={{ alignItems: "center", gap: 8 }}>
                            <MaterialCommunityIcons
                              name="star-outline"
                              size={18}
                              color="#aaa"
                            />
                          </XStack>
                        </Card>
                        <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>
                          {card.rarity || "-"}
                        </Text>
                      </XStack>
                      <XStack style={{ alignItems: "center", gap: 12 }}>
                        <Card
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            padding: 8,
                            borderRadius: 8,
                            width: 140,
                          }}
                        >
                          <XStack style={{ alignItems: "center", gap: 8 }}>
                            <MaterialCommunityIcons
                              name="pokeball"
                              size={18}
                              color="#aaa"
                            />
                          </XStack>
                        </Card>
                        <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>
                          {Array.isArray((card as any).types)
                            ? (card as any).types.join(", ")
                            : "-"}
                        </Text>
                      </XStack>
                      {card.evolvesFrom && (
                        <XStack style={{ alignItems: "center", gap: 12 }}>
                          <Card
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              padding: 8,
                              borderRadius: 8,
                              width: 140,
                            }}
                          >
                            <XStack style={{ alignItems: "center", gap: 8 }}>
                              <MaterialCommunityIcons
                                name="arrow-up-bold"
                                size={18}
                                color="#aaa"
                              />
                            </XStack>
                          </Card>
                          <Text
                            style={{ color: "#fff", fontSize: 16, flex: 1 }}
                          >
                            Evolves from {card.evolvesFrom}
                          </Text>
                        </XStack>
                      )}
                    </YStack>
                  </Card>
                </YStack>
              </XStack>
              {(card.cardMarketPrices || card.tcgPlayerPrices) && (
                <Card
                  borderRadius={16}
                  style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}
                >
                  <Text
                    fontSize={24}
                    fontWeight="bold"
                    style={{
                      color: "#fff",
                      backgroundColor: "rgba(44, 62, 80, 0.8)",
                      padding: 16,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  >
                    Prices
                  </Text>
                  <YStack>
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
                  </YStack>
                </Card>
              )}
              {card.attacks && card.attacks.length > 0 && (
                <Card
                  borderRadius={16}
                  style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}
                >
                  <Text
                    fontSize={24}
                    fontWeight="bold"
                    style={{
                      color: "#fff",
                      backgroundColor: "rgba(44, 62, 80, 0.8)",
                      padding: 16,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  >
                    Attacks
                  </Text>
                  <YStack>
                    {card.attacks.map((attack, idx) => (
                      <YStack key={idx} style={{ padding: 16, gap: 8 }}>
                        <XStack style={{ alignItems: "center", gap: 8 }}>
                          {attack.cost && renderEnergyCost(attack.cost)}
                          <Text
                            style={{
                              color: "#fff",
                              fontWeight: "bold",
                              fontSize: 18,
                            }}
                          >
                            {attack.name}
                          </Text>
                          <Text
                            style={{
                              color: "#fff",
                              fontWeight: "bold",
                              fontSize: 16,
                            }}
                          >
                            {attack.damage}
                          </Text>
                        </XStack>
                        <Text style={{ color: "#ccc", fontSize: 14 }}>
                          {attack.text}
                        </Text>
                      </YStack>
                    ))}
                  </YStack>
                </Card>
              )}
              <Card
                borderRadius={16}
                style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}
              >
                <Text
                  fontSize={24}
                  fontWeight="bold"
                  style={{
                    color: "#fff",
                    backgroundColor: "rgba(44, 62, 80, 0.8)",
                    padding: 16,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                >
                  Battle Attributes
                </Text>
                <XStack gap={24}>
                  <YStack
                    flex={1}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      padding: 16,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Weaknesses
                    </Text>
                    {card.weaknesses && card.weaknesses.length > 0 ? (
                      card.weaknesses.map((w, i) => (
                        <XStack
                          key={i}
                          style={{ alignItems: "center", gap: 8 }}
                        >
                          <Text
                            style={{
                              color: getTypeColor(w.type),
                              fontWeight: "bold",
                            }}
                          >
                            {w.type}
                          </Text>
                          <Text style={{ color: "#fff" }}>x{w.value}</Text>
                        </XStack>
                      ))
                    ) : (
                      <Text style={{ color: "#ccc" }}>-</Text>
                    )}
                  </YStack>
                  <YStack
                    flex={1}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      padding: 16,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Resistances
                    </Text>
                    {card.resistances && card.resistances.length > 0 ? (
                      card.resistances.map((r, i) => (
                        <XStack
                          key={i}
                          style={{ alignItems: "center", gap: 8 }}
                        >
                          <Text
                            style={{
                              color: getTypeColor(r.type),
                              fontWeight: "bold",
                            }}
                          >
                            {r.type}
                          </Text>
                          <Text style={{ color: "#fff" }}>x{r.value}</Text>
                        </XStack>
                      ))
                    ) : (
                      <Text style={{ color: "#ccc" }}>-</Text>
                    )}
                  </YStack>
                </XStack>
              </Card>
              <YStack style={{ marginHorizontal: 12 }}>
                <CardAction onAdd={handleAddCard} onRemove={handleRemoveCard} />
              </YStack>
            </YStack>
          ) : (
            <YStack>
              <AnimatedView style={cardAnimatedStyle}>
                <Card
                  style={{
                    alignItems: "center",
                    padding: 24,
                    ...getPlatformGlassmorphicStyle(
                      glassmorphicImageContainerStyles
                    ),
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                  }}
                >
                  <Card
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 16,
                      padding: 8,
                    }}
                  >
                    <AnimatedImage
                      source={{ uri: card.largeImageUrl }}
                      style={{
                        width: cardDimensions.width,
                        height: cardDimensions.height,
                        borderRadius: 12,
                      }}
                      resizeMode="contain"
                    />
                  </Card>
                </Card>
              </AnimatedView>
              <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                <Card
                  marginVertical="$4"
                  marginHorizontal="$4"
                  borderRadius={16}
                  style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}
                >
                  <Text
                    fontSize={24}
                    fontWeight="bold"
                    style={{
                      color: "#fff",
                      backgroundColor: "rgba(44, 62, 80, 0.8)",
                      padding: 16,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  >
                    Card Information
                  </Text>
                  <YStack space={16}>
                    <XStack style={{ alignItems: "center", gap: 12 }}>
                      <Card
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          padding: 8,
                          borderRadius: 8,
                          width: 120,
                        }}
                      >
                        <XStack style={{ alignItems: "center", gap: 8 }}>
                          <Ionicons
                            name="albums-outline"
                            size={18}
                            color="#aaa"
                          />
                        </XStack>
                      </Card>
                      <Text style={{ color: "#fff" }} fontSize="$3" flex={1}>
                        {card.setName || "Unknown"}
                      </Text>
                    </XStack>
                    <XStack style={{ alignItems: "center", gap: 12 }}>
                      <Card
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          padding: 8,
                          borderRadius: 8,
                          width: 120,
                        }}
                      >
                        <XStack style={{ alignItems: "center", gap: 8 }}>
                          <MaterialCommunityIcons
                            name="numeric"
                            size={18}
                            color="#aaa"
                          />
                        </XStack>
                      </Card>
                      <Text style={{ color: "#fff" }} fontSize="$3" flex={1}>
                        {card.number || "-"}
                      </Text>
                    </XStack>
                    <XStack style={{ alignItems: "center", gap: 12 }}>
                      <Card
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          padding: 8,
                          borderRadius: 8,
                          width: 120,
                        }}
                      >
                        <XStack style={{ alignItems: "center", gap: 8 }}>
                          <MaterialCommunityIcons
                            name="star-outline"
                            size={18}
                            color="#aaa"
                          />
                        </XStack>
                      </Card>
                      <Text style={{ color: "#fff" }} fontSize="$3" flex={1}>
                        {card.rarity || "-"}
                      </Text>
                    </XStack>
                    <XStack style={{ alignItems: "center", gap: 12 }}>
                      <Card
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          padding: 8,
                          borderRadius: 8,
                          width: 120,
                        }}
                      >
                        <XStack style={{ alignItems: "center", gap: 8 }}>
                          <MaterialCommunityIcons
                            name="pokeball"
                            size={18}
                            color="#aaa"
                          />
                        </XStack>
                      </Card>
                      <Text style={{ color: "#fff" }} fontSize="$3" flex={1}>
                        {Array.isArray((card as any).types)
                          ? (card as any).types.join(", ")
                          : "-"}
                      </Text>
                    </XStack>
                    {card.evolvesFrom && (
                      <XStack style={{ alignItems: "center", gap: 12 }}>
                        <Card
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            padding: 8,
                            borderRadius: 8,
                            width: 120,
                          }}
                        >
                          <XStack style={{ alignItems: "center", gap: 8 }}>
                            <MaterialCommunityIcons
                              name="arrow-up-bold"
                              size={18}
                              color="#aaa"
                            />
                          </XStack>
                        </Card>
                        <Text style={{ color: "#fff" }} fontSize="$3" flex={1}>
                          Evolves from {card.evolvesFrom}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </Card>
              </Animated.View>
              {(card.cardMarketPrices || card.tcgPlayerPrices) && (
                <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                  <Card
                    marginVertical="$4"
                    marginHorizontal="$4"
                    borderRadius={16}
                    style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}
                  >
                    <Text
                      fontSize={24}
                      fontWeight="bold"
                      style={{
                        color: "#fff",
                        backgroundColor: "rgba(44, 62, 80, 0.8)",
                        padding: 16,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    >
                      Prices
                    </Text>
                    <YStack>
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
                    </YStack>
                  </Card>
                </Animated.View>
              )}
              {card.attacks && card.attacks.length > 0 && (
                <Animated.View entering={FadeInDown.delay(500).duration(500)}>
                  <Card
                    marginVertical="$4"
                    marginHorizontal="$4"
                    borderRadius={16}
                    style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}
                  >
                    <Text
                      fontSize={24}
                      fontWeight="bold"
                      style={{
                        color: "#fff",
                        backgroundColor: "rgba(44, 62, 80, 0.8)",
                        padding: 16,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    >
                      Attacks
                    </Text>
                    <YStack>
                      {card.attacks.map((attack, idx) => (
                        <YStack key={idx} style={{ padding: 16, gap: 8 }}>
                          <XStack style={{ alignItems: "center", gap: 8 }}>
                            {attack.cost && renderEnergyCost(attack.cost)}
                            <Text
                              style={{
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: 18,
                              }}
                            >
                              {attack.name}
                            </Text>
                            <Text
                              style={{
                                color: "#fff",
                                fontWeight: "bold",
                                fontSize: 16,
                              }}
                            >
                              {attack.damage}
                            </Text>
                          </XStack>
                          <Text style={{ color: "#ccc", fontSize: 14 }}>
                            {attack.text}
                          </Text>
                        </YStack>
                      ))}
                    </YStack>
                  </Card>
                </Animated.View>
              )}
              <Animated.View entering={FadeInDown.delay(600).duration(500)}>
                <Card
                  marginVertical="$4"
                  marginHorizontal="$4"
                  borderRadius={16}
                  style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}
                >
                  <Text
                    fontSize={24}
                    fontWeight="bold"
                    style={{
                      color: "#fff",
                      backgroundColor: "rgba(44, 62, 80, 0.8)",
                      padding: 16,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }}
                  >
                    Battle Attributes
                  </Text>
                  <XStack gap={24}>
                    <YStack
                      flex={1}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        padding: 16,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Weaknesses
                      </Text>
                      {card.weaknesses && card.weaknesses.length > 0 ? (
                        card.weaknesses.map((w, i) => (
                          <XStack
                            key={i}
                            style={{ alignItems: "center", gap: 8 }}
                          >
                            <Text
                              style={{
                                color: getTypeColor(w.type),
                                fontWeight: "bold",
                              }}
                            >
                              {w.type}
                            </Text>
                            <Text style={{ color: "#fff" }}>x{w.value}</Text>
                          </XStack>
                        ))
                      ) : (
                        <Text style={{ color: "#ccc" }}>-</Text>
                      )}
                    </YStack>
                    <YStack
                      flex={1}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        padding: 16,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Resistances
                      </Text>
                      {card.resistances && card.resistances.length > 0 ? (
                        card.resistances.map((r, i) => (
                          <XStack
                            key={i}
                            style={{ alignItems: "center", gap: 8 }}
                          >
                            <Text
                              style={{
                                color: getTypeColor(r.type),
                                fontWeight: "bold",
                              }}
                            >
                              {r.type}
                            </Text>
                            <Text style={{ color: "#fff" }}>x{r.value}</Text>
                          </XStack>
                        ))
                      ) : (
                        <Text style={{ color: "#ccc" }}>-</Text>
                      )}
                    </YStack>
                  </XStack>
                </Card>
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(700).duration(500)}>
                <YStack style={{ marginHorizontal: 12, marginBottom: 24 }}>
                  <CardAction
                    onAdd={handleAddCard}
                    onRemove={handleRemoveCard}
                  />
                </YStack>
              </Animated.View>
            </YStack>
          )}
        </ScrollView>
      </YStack>
    </Theme>
  );
}
