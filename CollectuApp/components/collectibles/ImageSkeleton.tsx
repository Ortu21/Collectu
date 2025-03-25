import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

interface ImageSkeletonProps {
  style?: any;
}

export const ImageSkeleton = ({ style }: ImageSkeletonProps) => {
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
        easing: Easing.linear 
      }),
      -1,
      false
    );
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.shimmerContainer}>
        <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#444',
    overflow: 'hidden',
  },
  shimmerContainer: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  shimmer: {
    width: '400%',
    height: '100%',
    opacity: 0.5,
  },
});