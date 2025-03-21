import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PokemonPrice } from '../../types/pokemon';
import { PriceTable } from './PriceTable';

type CardMarketPricesProps = {
  prices: PokemonPrice;
  formatPrice: (price: number | undefined | null) => string;
};

export const CardMarketPrices = ({ prices, formatPrice }: CardMarketPricesProps) => {
  if (!prices || !prices.priceDetails || prices.priceDetails.length === 0) {
    return null;
  }

  return (
    <View style={styles.priceSection}>
      <Text style={styles.priceSourceTitle}>CardMarket</Text>
      <Text style={styles.priceUpdated}>
        Updated: {prices.updatedAt}
      </Text>
      
      {prices.priceDetails.map((detail, index) => (
        <PriceTable 
          key={`cm-price-${index}`} 
          priceDetail={detail} 
          formatPrice={formatPrice} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  priceSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  priceSourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  priceUpdated: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 12,
  },
});