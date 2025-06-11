import React, { useEffect, memo } from "react";
import { Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Card, YStack, XStack, Text, Image, H6 } from "tamagui";
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
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.95);

    const animatedStyles = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
      setTimeout(() => {
        opacity.value = withTiming(1, { duration: 500 });
        scale.value = withSpring(1, { damping: 20, stiffness: 90 });
      }, animationDelay);
    }, [animationDelay]);

    const imageHeight = cardDimensions ? cardDimensions.height * 0.8 : 240;
    const AnimatedCard =
      Platform.OS === "web"
        ? Animated.createAnimatedComponent(Card)
        : Animated.createAnimatedComponent(Card);

    return (
      <AnimatedCard
        elevate
        bordered
        animation="bouncy"
        scale={0.9}
        hoverStyle={{ scale: 1.05 }}
        pressStyle={{ scale: 1 }}
        style={animatedStyles}
        onPress={() => onPress(card)}
      >
        <Card.Header
          padding={"$2"}
          borderRadius={12}
          marginBottom="$2"
          marginTop={"$2"}
        >
          <Image
            source={{ uri: card.smallImageUrl || card.largeImageUrl }}
            style={{
              width: "100%",
              height: imageHeight,
            }}
            resizeMode="contain"
          />
        </Card.Header>

        <Card.Footer padding={"$2"}>
          <YStack gap="$2" padding={"$2"} width="100%">
            <H6 fontWeight="bold">{card.name}</H6>

            <Text>{card.rarity || "Common"}</Text>

            <XStack
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text>{card.setName || "Unknown Set"}</Text>
              <Card
                bordered
                paddingHorizontal="$2"
                paddingVertical="$1"
                marginLeft="$2"
              >
                <Text style={{ color: "$" }}>#{card.number || "?"}</Text>
              </Card>
            </XStack>
          </YStack>
        </Card.Footer>
      </AnimatedCard>
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
