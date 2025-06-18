import React, { useEffect, memo } from "react";
import { Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Card, YStack, XStack, Text, Image, H6, useTheme } from "tamagui";
import { PokemonCard } from "../../types/pokemon";

// Utility per estrarre sempre una stringa colore
function getColor(token: any, fallback?: string) {
  if (!token) return fallback || undefined;
  if (typeof token === 'string') return token;
  if (typeof token === 'object' && typeof token.val === 'string') return token.val;
  return fallback || undefined;
}

interface CardItemProps {
  card: PokemonCard;
  onPress: (card: PokemonCard) => void;
  cardDimensions?: {
    width: number;
    height: number;
  };
  animationDelay?: number;
  theme: any; // TODO: Use proper type when available
}

export const CardItem = memo(
  ({ card, onPress, cardDimensions, animationDelay = 0, theme }: CardItemProps) => {
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

    const imageHeight = cardDimensions ? cardDimensions.width * 0.7 : 180;
    const AnimatedCard =
      Platform.OS === "web"
        ? Animated.createAnimatedComponent(Card)
        : Animated.createAnimatedComponent(Card);

    // Color tokens & contrast helpers
    const bgVal = getColor(theme.background);
    const isLight = bgVal && bgVal.includes('85%');
    const cardBg = bgVal;
    const cardBorder = getColor(theme.color6);
    const cardShadow = getColor(theme.shadow4, isLight ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.32)');
    const nameColor = getColor(theme.color12, getColor(theme.color));
    const rarityColor = getColor(theme.accent10, getColor(theme.accent8));
    const setColor = getColor(theme.color8, getColor(theme.color7, getColor(theme.color)));
    const numberBg = getColor(theme.color4, getColor(theme.accent3));
    const numberColor = getColor(theme.color12, getColor(theme.color));
    const hoverBg = getColor(theme.color3, getColor(theme.accent2));
    const hoverBorder = getColor(theme.accent5, getColor(theme.color6));
    const hoverShadow = getColor(theme.shadow6, isLight ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.45)');

    return (
      <AnimatedCard
        elevate
        bordered
        animation="quick"
        scale={0.97}
        hoverStyle={{
          scale: 1.04,
          y: -6,
          shadowColor: hoverShadow,
          shadowRadius: 18,
          borderColor: hoverBorder,
          backgroundColor: hoverBg,
          animation: 'bouncy',
        }}
        pressStyle={{ scale: 0.98, y: 0 }}
        style={[
          animatedStyles,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            borderWidth: 1.5,
            borderRadius: 18,
            shadowColor: cardShadow,
            shadowOpacity: 0.18,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            overflow: 'hidden',
            transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
          },
        ]}
        onPress={() => onPress(card)}
      >
        <YStack width="100%" gap={0}>
          <Image
            source={{ uri: card.smallImageUrl || card.largeImageUrl }}
            style={{
              width: '100%',
              height: imageHeight,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              backgroundColor: getColor(theme.color2),
              marginBottom: 0,
            }}
            resizeMode="contain"
          />
          <YStack gap={8} padding={16} width="100%">
            <H6 fontWeight="900" color={nameColor} fontSize={20} marginBottom={2}>
              {card.name}
            </H6>
            <Text color={rarityColor} fontSize={15} fontWeight="700" marginBottom={2}>
              {card.rarity || "Common"}
            </Text>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              marginTop={4}
            >
              <Text color={setColor} fontSize={14} fontWeight="500">
                {card.setName || "Unknown Set"}
              </Text>
              <YStack
                backgroundColor={numberBg}
                borderRadius={8}
                paddingHorizontal={12}
                paddingVertical={4}
                marginLeft={10}
                alignItems="center"
                justifyContent="center"
                minWidth={38}
              >
                <Text color={numberColor} fontSize={14} fontWeight="bold">
                  #{card.number || "?"}
                </Text>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </AnimatedCard>
    );
  },
  (prevProps, nextProps) => {
    const prevThemeVal = prevProps.theme.background?.val;
    const nextThemeVal = nextProps.theme.background?.val;
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.cardDimensions?.width === nextProps.cardDimensions?.width &&
      prevProps.cardDimensions?.height === nextProps.cardDimensions?.height &&
      prevThemeVal === nextThemeVal
    );
  }
);
