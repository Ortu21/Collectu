import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface CardSkeletonProps {
  cardDimensions?: {
    width: number;
    height: number;
  };
}

export const CardSkeleton = ({ cardDimensions }: CardSkeletonProps) => {
  // Create animation value for the shimmer effect
  const shimmerPosition = useSharedValue(0);

  // Create animated style for shimmer effect
  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: shimmerPosition.value,
        },
      ],
    };
  });

  useEffect(() => {
    // Create a looping animation for the shimmer effect
    shimmerPosition.value = withRepeat(
      withTiming(-300, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.cardImage,
          cardDimensions ? { height: cardDimensions.height * 0.6 } : null,
        ]}
      >
        <View style={styles.shimmerContainer}>
          <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
        </View>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardName}>
          <View style={styles.shimmerContainer}>
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
          </View>
        </View>
        <View style={styles.cardRarity}>
          <View style={styles.shimmerContainer}>
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
          </View>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.cardSet}>
            <View style={styles.shimmerContainer}>
              <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
            </View>
          </View>
          <View style={styles.cardNumber}>
            <View style={styles.shimmerContainer}>
              <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#444",
    overflow: "hidden",
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    height: 20,
    backgroundColor: "#444",
    marginBottom: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  cardRarity: {
    height: 16,
    backgroundColor: "#444",
    marginBottom: 8,
    width: "40%",
    borderRadius: 4,
    overflow: "hidden",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: "400%",
    height: "100%",
    backgroundColor: "#444",
    opacity: 0.5,
  },
});
