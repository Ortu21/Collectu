import React, { useEffect, memo, useRef } from "react";
import { Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { YStack, XStack, Text, Image } from "tamagui";
import { PokemonCard } from "../../types/pokemon"; // Adjust path if necessary

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
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.95);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    });

    useEffect(() => {
      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 500 });
        scale.value = withSpring(1, { damping: 20, stiffness: 90 });
      }, animationDelay);
    }, [animationDelay]);

    const cardIdRef = useRef(card.id);

    useEffect(() => {
      if (cardIdRef.current !== card.id) {
        cardIdRef.current = card.id;
      }
    }, [card.id]);

    const AnimatedContainer =
      Platform.OS === "web"
        ? Animated.createAnimatedComponent(YStack)
        : Animated.View;

    const imageHeight = cardDimensions ? cardDimensions.height * 0.6 : 180;

    return (
      <AnimatedContainer style={animatedStyles} flex={1}>
        <YStack
          backgroundColor="$background"
          borderRadius={12}
          padding={16}
          width="100%"
          height={imageHeight}
          position="relative"
          overflow="hidden"
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
              borderRadius: 8,
            }}
            resizeMode="contain"
          />
        </YStack>

        <YStack
          backgroundColor="$background"
          padding={12}
          borderRadius={12}
          overflow="hidden"
          marginTop={8} // Added some margin for separation
        >
          <Text
            fontSize={16}
            fontWeight="bold"
            color="$color.gray12"
            marginBottom={4}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {card.name}
          </Text>

          <Text
            fontSize={12}
            color="$accentColor9" // Example: Using accent color for rarity
            marginBottom={4}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {card.rarity || "Common"}
          </Text>

          <XStack
            justifyContent="space-between"
            alignItems="center"
          >
            <Text
              fontSize={12}
              color="$color.gray10"
              flex={1}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {card.setName || "Unknown Set"}
            </Text>

            <YStack
              backgroundColor="$backgroundTransparent"
              borderRadius={6}
              paddingHorizontal={6}
              paddingVertical={2}
              marginLeft={8}
            >
              <Text
                fontSize={11}
                color="$color.gray11"
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
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.cardDimensions?.width === nextProps.cardDimensions?.width &&
      prevProps.cardDimensions?.height === nextProps.cardDimensions?.height
    );
  }
);