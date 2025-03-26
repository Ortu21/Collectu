import React, { useEffect, useState, memo, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { PokemonCard } from '../../types/pokemon';
import { ImageSkeleton } from './ImageSkeleton';

interface CardItemProps {
  card: PokemonCard;
  onPress: (card: PokemonCard) => void;
  cardDimensions?: {
    width: number;
    height: number;
  };
  animationDelay?: number;
}

export const CardItem = memo(({ card, onPress, cardDimensions, animationDelay = 0 }: CardItemProps) => {
  // Reanimated shared values for animations
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  // Create animated styles
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    };
  });

  useEffect(() => {
    // Start animations when component mounts with delay based on position
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500 });
      scale.value = withSpring(1, { damping: 20, stiffness: 90 });
    }, animationDelay);
  }, [animationDelay]);

  // State to track image loading status with a ref to avoid unnecessary re-renders
  const [isImageLoading, setIsImageLoading] = useState(true);
  const imageLoadingRef = useRef(true);
  const cardIdRef = useRef(card.id);
  
  // Only reset loading state when card ID actually changes
  useEffect(() => {
    if (cardIdRef.current !== card.id) {
      setIsImageLoading(true);
      imageLoadingRef.current = true;
      cardIdRef.current = card.id;
    }
  }, [card.id]);

  // Use a regular View with animated styles for web compatibility
  const AnimatedContainer = Platform.OS === 'web' ? Animated.createAnimatedComponent(View) : Animated.View;

  return (
    <AnimatedContainer 
      style={[
        styles.container, 
        animatedStyles
      ]}
    >
      <View
        style={[
          styles.cardImageContainer,
          cardDimensions ? { height: cardDimensions.height * 0.6 } : null
        ]}
      >
        {isImageLoading && (
          <ImageSkeleton 
            style={[
              styles.cardImage,
              cardDimensions ? { height: cardDimensions.height * 0.6 } : null
            ]}
          />
        )}
        <Image
          source={{ uri: card.smallImageUrl || card.largeImageUrl }}
          style={[
            styles.cardImage,
            isImageLoading ? styles.hiddenImage : null,
            cardDimensions ? { height: cardDimensions.height * 0.6 } : null
          ]}
          resizeMode="contain"
          defaultSource={require('../../assets/images/card-placeholder.png')}
          // These handlers ensure proper loading state management
          onLoad={() => {
            if (imageLoadingRef.current) {
              imageLoadingRef.current = false;
              setIsImageLoading(false);
            }
          }}
          onError={() => {
            if (imageLoadingRef.current) {
              imageLoadingRef.current = false;
              setIsImageLoading(false);
            }
          }}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1} ellipsizeMode="tail">
          {card.name}
        </Text>
        <Text style={styles.cardRarity} numberOfLines={1} ellipsizeMode="tail">
          {card.rarity || 'Common'}
        </Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardSet} numberOfLines={1} ellipsizeMode="tail">
            {card.setName || 'Unknown Set'}
          </Text>
          <Text style={styles.cardNumber}>
            {card.number || '?'}
          </Text>
        </View>
      </View>
    </AnimatedContainer>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the card ID changes or dimensions change
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.cardDimensions?.width === nextProps.cardDimensions?.width &&
    prevProps.cardDimensions?.height === nextProps.cardDimensions?.height
  );
});

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hiddenImage: {
    opacity: 0,
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  cardRarity: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 4,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardSet: {
    fontSize: 12,
    color: '#6c757d',
    flex: 1,
  },
  cardNumber: {
    fontSize: 12,
    color: '#6c757d',
  },
});