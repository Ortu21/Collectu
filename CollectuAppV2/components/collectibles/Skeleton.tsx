import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from 'tamagui';

// Utility per estrarre sempre una stringa colore
function getColor(token: any, fallback?: string) {
  if (!token) return fallback || undefined;
  if (typeof token === 'string') return token;
  if (typeof token === 'object' && typeof token.val === 'string') return token.val;
  return fallback || undefined;
}

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
  animationDelay?: number;
  variant?: 'card' | 'image' | 'text' | 'circle';
  cardDimensions?: {
    width: number;
    height: number;
  };
}

export const Skeleton = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
  animationDelay = 0,
  variant = 'text',
  cardDimensions,
}: SkeletonProps) => {
  const theme = useTheme();
  const shimmerPosition = useSharedValue(-400);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  // Colori dinamici
  const bg = getColor(theme.background, '#fff');
  const strongBg = getColor(theme.backgroundStrong, '#f5f5f5');
  const focusBg = getColor(theme.backgroundFocus, '#ececec');
  const hoverBg = getColor(theme.backgroundHover, '#e0e0e0');

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: shimmerPosition.value,
        },
      ],
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    setTimeout(() => {
      shimmerPosition.value = withRepeat(
        withTiming(400 + (typeof width === 'number' ? width : 200), {
          duration: 1500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        }),
        -1,
        false
      );

      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    }, animationDelay);
  }, [animationDelay, width]);

  const styles = StyleSheet.create({
    cardContainer: {
      flex: 1,
    },
    cardImageContainer: {
      width: "100%",
      height: cardDimensions ? cardDimensions.height * 0.6 : 180,
      position: "relative",
      overflow: "hidden",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: strongBg,
    },
    cardImage: {
      width: "100%",
      height: "100%",
      backgroundColor: focusBg,
      overflow: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    cardInfo: {
      padding: 10,
      backgroundColor: bg,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    cardName: {
      width: '70%',
      height: 20,
      backgroundColor: focusBg,
      borderRadius: 4,
      marginBottom: 6,
      overflow: "hidden",
    },
    cardRarity: {
      width: '50%',
      height: 15,
      backgroundColor: focusBg,
      borderRadius: 4,
      marginBottom: 8,
      overflow: "hidden",
    },
    cardDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cardSet: {
      width: '60%',
      height: 15,
      backgroundColor: focusBg,
      borderRadius: 4,
      overflow: "hidden",
    },
    cardNumber: {
      width: '30%',
      height: 15,
      backgroundColor: focusBg,
      borderRadius: 4,
      overflow: "hidden",
    },
    shimmer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: hoverBg,
      opacity: 0.3,
    },
    baseContainer: {
      backgroundColor: focusBg,
      overflow: "hidden",
      position: 'relative',
    },
    imageContainer: {
      backgroundColor: focusBg,
      overflow: "hidden",
      position: 'relative',
    }
  });

  const getSkeletonContent = () => {
    switch (variant) {
      case 'card':
        return (
          <View style={styles.cardContainer}>
            <View style={styles.cardImageContainer}>
              <View style={styles.cardImage}>
                <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
              </View>
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.cardName}>
                <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
              </View>
              <View style={styles.cardRarity}>
                <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.cardSet}>
                  <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
                </View>
                <View style={styles.cardNumber}>
                  <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
                </View>
              </View>
            </View>
          </View>
        );
      case 'image':
        return (
          <View style={[
            styles.imageContainer,
            { width, height },
            cardDimensions ? {
              width: cardDimensions.width,
              height: cardDimensions.height * 0.6
            } : null,
            style
          ]}>
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
          </View>
        );
      case 'circle':
        return (
          <View style={[
            styles.baseContainer,
            {
              width,
              height,
              borderRadius: typeof width === 'number' ? width / 2 : 50,
            },
            style
          ]}>
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
          </View>
        );
      default:
        return (
          <View style={[
            styles.baseContainer,
            { width, height, borderRadius },
            style
          ]}>
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
          </View>
        );
    }
  };

  return (
    <Animated.View style={[containerAnimatedStyle, style]}>
      {getSkeletonContent()}
    </Animated.View>
  );
};