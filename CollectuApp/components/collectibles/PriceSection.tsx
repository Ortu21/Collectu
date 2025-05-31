import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PokemonPrice, PokemonPriceDetail } from '../../types/pokemon';
import { PriceTable } from './PriceTable';
import { extractArray } from '../../utils/circularReferenceHandler';

type PriceSectionProps = {
  prices: PokemonPrice;
  title: string;
  formatPrice: (price: number | undefined | null) => string;
};

export const PriceSection = ({ prices, title, formatPrice }: PriceSectionProps) => {
  // Safely extract price details array using the utility function
  const priceDetails = prices ? extractArray<PokemonPriceDetail>(prices.priceDetails, []) : [];
  
  if (!prices || priceDetails.length === 0) {
    return null;
  }

  return (
    <View style={styles.priceSection}>
      <Text style={styles.priceSourceTitle}>{title}</Text>
      <Text style={styles.priceUpdated}>
        Updated: {prices.updatedAt}
      </Text>
      
      {priceDetails.map((detail, index) => (
        <View key={`price-${index}`} style={styles.priceDetailContainer}>
          {detail.foilType && (
            <Text style={styles.foilTypeText}>{detail.foilType}</Text>
          )}
          <PriceTable 
            key={`price-detail-${index}`} 
            priceDetail={detail} 
            formatPrice={formatPrice} 
          />
        </View>
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
  priceDetailContainer: {
    marginBottom: 16,
  },
  foilTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ddd',
    marginBottom: 8,
    textAlign: 'center',
  },
});