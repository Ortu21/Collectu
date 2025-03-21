import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PokemonPrice, PokemonPriceDetail } from '../../types/pokemon';
import { PriceTable } from './PriceTable';
import { extractArray } from '../../utils/circularReferenceHandler';

type CardMarketPricesProps = {
  prices: PokemonPrice;
  formatPrice: (price: number | undefined | null) => string;
};

export const CardMarketPrices = ({ prices, formatPrice }: CardMarketPricesProps) => {
  // Safely extract price details array using the utility function
  const priceDetails = prices ? extractArray<PokemonPriceDetail>(prices.priceDetails, []) : [];
  
  if (!prices || priceDetails.length === 0) {
    return null;
  }

  return (
    <View style={styles.priceSection}>
      <Text style={styles.priceSourceTitle}>CardMarket</Text>
      <Text style={styles.priceUpdated}>
        Updated: {prices.updatedAt}
      </Text>
      
      {priceDetails.map((detail, index) => (
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