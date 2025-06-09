import React, { useEffect, useState, memo, useRef } from "react";
import { TouchableOpacity, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { YStack, XStack, Text, Image } from "tamagui";
import { PokemonCard } from "../../types/pokemon";


interface CardItemProps {
  card: PokemonCard;
  onPress: (card: PokemonCard) => void;
  cardDimensions?: {
    width: number;
    height: number;
  };
  animationDelay?: number;
}

export const CardItem = memo(
  ({ card, onPress, cardDimensions, animationDelay = 0 }: CardItemProps) => {
    // Reanimated shared values for animations
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.95);

    // Create animated styles
    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    });

    useEffect(() => {
      // Applica sempre l'animazione con ritardo all'apparizione del CardItem
      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 500 });
        scale.value = withSpring(1, { damping: 20, stiffness: 90 });
      }, animationDelay);
    }, [animationDelay]);

    // Non abbiamo più bisogno dello stato di caricamento dell'immagine qui
    // const [isImageLoading, setIsImageLoading] = useState(true);
    // const imageLoadingRef = useRef(true);
    const cardIdRef = useRef(card.id);

    // Aggiorna il ref dell'ID carta se cambia
    useEffect(() => {
      if (cardIdRef.current !== card.id) {
        cardIdRef.current = card.id;
      }
    }, [card.id]);

    // Use a regular YStack with animated styles for web compatibility
    const AnimatedContainer =
      Platform.OS === "web"
        ? Animated.createAnimatedComponent(YStack)
        : Animated.View;

    const imageHeight = cardDimensions ? cardDimensions.height * 0.6 : 180;

    return (
      <AnimatedContainer style={animatedStyles} flex={1}>
        {/* Applica gli stili glassmorphic centralizzati al contenitore dell'immagine */}
        <YStack
          style={{
            backgroundColor: "var(--background)",
            borderRadius: 12,
            padding: 16,
            width: "100%",
            height: imageHeight,
            position: "relative",
            overflow: "hidden", // Mantieni overflow hidden per i bordi arrotondati
            // backgroundColor, borderWidth, borderColor, borderTopLeftRadius, borderTopRightRadius, borderBottomWidth, boxShadow/elevation sono inclusi
          }}
        >
          <Image
            source={{ uri: card.smallImageUrl || card.largeImageUrl }}
            style={{
              width: "100%",
              height: imageHeight,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 8, // Manteniamo un leggero raggio per l'immagine stessa
            }}
            resizeMode="contain"
            // Rimuovi i gestori onLoad e onError, l'immagine gestirà la sua visibilità automaticamente
          />
        </YStack>

        {/* Applica gli stili glassmorphic centralizzati al contenitore delle informazioni */}
        <YStack
          style={{
            backgroundColor: "var(--background)",
            padding: 12,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Text
            fontSize={16}
            fontWeight="bold"
            color="rgba(255, 255, 255, 0.95)"
            style={{
              marginBottom: 4,
              textShadow: "0 0 8px rgba(255, 255, 255, 0.1)",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {card.name}
          </Text>

          <Text
            fontSize={12}
            color="#007AFF"
            style={{
              marginBottom: 4,
              textShadow: "0 0 6px rgba(0, 122, 255, 0.3)",
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {card.rarity || "Common"}
          </Text>

          <XStack
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              fontSize={12}
              color="rgba(255, 255, 255, 0.6)"
              style={{ flex: 1 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {card.setName || "Unknown Set"}
            </Text>

            <YStack
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 2,
                marginLeft: 8,
              }}
            >
              <Text
                fontSize={11}
                color="rgba(255, 255, 255, 0.8)"
                fontWeight="500"
              >
                #{card.number || "?"}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </AnimatedContainer>
    );
  },
  (prevProps, nextProps) => {
    // La memoizzazione si basa solo sull'ID carta e sulle dimensioni
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.cardDimensions?.width === nextProps.cardDimensions?.width &&
      prevProps.cardDimensions?.height === nextProps.cardDimensions?.height
    );
  },
);
