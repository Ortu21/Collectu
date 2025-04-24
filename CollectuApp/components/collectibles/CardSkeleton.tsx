import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import LinearGradient from 'react-native-linear-gradient';

interface CardSkeletonProps {
  cardDimensions?: {
    width: number;
    height: number;
  };
  animationDelay?: number;
}

export const CardSkeleton = ({
  cardDimensions,
  animationDelay = 0,
}: CardSkeletonProps) => {
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

  // Create animated style for container
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    setTimeout(() => {
      shimmerPosition.value = withRepeat(
        withTiming(300, {
          duration: 2000,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Curva di easing più elegante e naturale
        }),
        -1,
        true
      );

      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    }, animationDelay);
  }, [animationDelay]);

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <View
        style={[
          styles.cardImageContainer,
          cardDimensions ? { height: cardDimensions.height * 0.6 } : null,
        ]}
      >
        <View
          style={[
            styles.cardImage,
            cardDimensions ? { height: cardDimensions.height * 0.6 } : null,
          ]}
        >
          <View style={styles.shimmer}>
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
          </View>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardName}>
          <View style={styles.shimmer}>
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
          </View>
        </View>
        <View style={styles.cardRarity}>
          <View style={styles.shimmer}>
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
          </View>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.cardSet}>
            <View style={styles.shimmer}>
              <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
            </View>
            </View>
          </View>
          <View style={styles.cardNumber}>
            <View style={styles.shimmer}>
              <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
            </View>
            </View>
          </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardImageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    overflow: "hidden", // Assicura che il contenuto rispetti il bordo arrotondato
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#444",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    height: 20,
    backgroundColor: "#444",
    marginBottom: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  cardRarity: {
    height: 16,
    backgroundColor: "#444",
    marginBottom: 4,
    width: "40%",
    borderRadius: 4,
    overflow: "hidden",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cardSet: {
    height: 16,
    backgroundColor: "#444",
    flex: 1,
    marginRight: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  cardNumber: {
    height: 16,
    backgroundColor: "#444",
    width: 30,
    borderRadius: 4,
    overflow: "hidden",
  },
  shimmerContainer: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  shimmer: {
    width: '300%',
    height: '100%',
    opacity: 0.8,
  },
});
