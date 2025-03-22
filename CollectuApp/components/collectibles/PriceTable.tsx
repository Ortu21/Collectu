import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PokemonPriceDetail } from '../../types/pokemon';

type PriceTableProps = {
  priceDetail: PokemonPriceDetail;
  formatPrice: (price: number | undefined | null) => string;
};

export const PriceTable = ({ priceDetail, formatPrice }: PriceTableProps) => {
  // Determina se è un prezzo CardMarket o TCGPlayer in base ai campi presenti
  const isCardMarket = priceDetail.averageSellPrice !== undefined || 
                       priceDetail.trendPrice !== undefined || 
                       priceDetail.suggestedPrice !== undefined;

  return (
    <View style={styles.priceTable}>
      {isCardMarket ? (
        // CardMarket price layout
        <View style={styles.priceRow}>
          {priceDetail.averageSellPrice && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Avg Sell</Text>
              <Text style={styles.priceValue}>
                {formatPrice(priceDetail.averageSellPrice)}
              </Text>
            </View>
          )}
          
          {priceDetail.trendPrice && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Trend</Text>
              <Text style={styles.priceValue}>
                {formatPrice(priceDetail.trendPrice)}
              </Text>
            </View>
          )}
          
          {priceDetail.low && (
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Low</Text>
              <Text style={styles.priceValue}>
                {formatPrice(priceDetail.low)}
              </Text>
            </View>
          )}
        </View>
      ) : (
        // TCGPlayer price layout
        <>
          <View style={styles.priceRow}>
            {priceDetail.low && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Low</Text>
                <Text style={styles.priceValue}>{formatPrice(priceDetail.low)}</Text>
              </View>
            )}
            
            {priceDetail.mid && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Mid</Text>
                <Text style={styles.priceValue}>{formatPrice(priceDetail.mid)}</Text>
              </View>
            )}
            
            {priceDetail.high && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>High</Text>
                <Text style={styles.priceValue}>{formatPrice(priceDetail.high)}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.priceRow}>
            {priceDetail.market && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Market</Text>
                <Text style={styles.priceValue}>{formatPrice(priceDetail.market)}</Text>
              </View>
            )}
            
            {priceDetail.directLow && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Direct Low</Text>
                <Text style={styles.priceValue}>{formatPrice(priceDetail.directLow)}</Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  priceTable: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71',
  }
});