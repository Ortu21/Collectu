import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from 'tamagui'; // Import useTheme

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
  const theme = useTheme(); // Get current theme
  const shimmerPosition = useSharedValue(-400);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

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
        withTiming(400 + (typeof width === 'number' ? width : 200), { // Adjust shimmer travel based on width
          duration: 1500, // Slightly faster shimmer
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        }),
        -1,
        false // No yoyo
      );

      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    }, animationDelay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationDelay, width]); // Added width to dependencies

  // Define styles inside the component to access theme
  const styles = StyleSheet.create({
    cardContainer: {
      flex: 1,
    },
    cardImageContainer: {
      width: "100%",
      height: cardDimensions ? cardDimensions.height * 0.6 : 180, // Use passed height or default
      position: "relative",
      overflow: "hidden",
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: theme.backgroundStrong?.val, // Use theme variable
    },
    cardImage: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.backgroundFocus?.val, // Use theme variable
      overflow: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    cardInfo: {
      padding: 10,
      backgroundColor: theme.background?.val, // Use theme variable
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    cardName: {
      width: '70%',
      height: 20,
      backgroundColor: theme.backgroundFocus?.val, // Use theme variable
      borderRadius: 4,
      marginBottom: 6,
      overflow: "hidden",
    },
    cardRarity: {
      width: '50%',
      height: 15,
      backgroundColor: theme.backgroundFocus?.val, // Use theme variable
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
      backgroundColor: theme.backgroundFocus?.val, // Use theme variable
      borderRadius: 4,
      overflow: "hidden",
    },
    cardNumber: {
      width: '30%',
      height: 15,
      backgroundColor: theme.backgroundFocus?.val, // Use theme variable
      borderRadius: 4,
      overflow: "hidden",
    },
    shimmer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.backgroundHover?.val, // Shimmer color from theme
      opacity: 0.3, // Shimmer opacity
    },
    baseContainer: {
      backgroundColor: theme.backgroundFocus?.val, // Use theme variable
      overflow: "hidden",
      position: 'relative',
    },
    imageContainer: {
      backgroundColor: theme.backgroundFocus?.val, // Use theme variable
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
      default: // text
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
    <Animated.View style={[containerAnimatedStyle, style]}> {/* Added style prop here */}
      {getSkeletonContent()}
    </Animated.View>
  );
};