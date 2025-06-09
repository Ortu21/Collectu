import React from 'react';
import { YStack, Text } from 'tamagui';
import { PokemonPrice, PokemonPriceDetail } from '../../types/pokemon';
import { PriceTable } from '../id/PriceTable';
import { extractArray } from '../../utils/circularReferenceHandler';

type PriceSectionProps = {
  prices: PokemonPrice;
  title: string;
  formatPrice: (price: number | undefined | null) => string;
};

export const PriceSection = ({ prices, title, formatPrice }: PriceSectionProps) => {
  const priceDetails = prices ? extractArray<PokemonPriceDetail>(prices.priceDetails, []) : [];
  
  if (!prices || priceDetails.length === 0) {
    return null;
  }

  return (
    <YStack style={{ backgroundColor: 'var(--backgroundStrong)', borderRadius: 16, padding: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--color1)', marginBottom: 4 }}>{title}</Text>
      <Text style={{ fontSize: 12, color: 'var(--color7)', marginBottom: 12 }}>
        Updated: {prices.updatedAt}
      </Text>
      
      {priceDetails.map((detail, index) => (
        <YStack key={`price-${index}`} style={{ marginBottom: 16 }}>
          {detail.foilType && (
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--color2)', marginBottom: 8, textAlign: 'center' }}>{detail.foilType}</Text>
          )}
          <PriceTable 
            key={`price-detail-${index}`} 
            priceDetail={detail} 
            formatPrice={formatPrice} 
          />
        </YStack>
      ))}
    </YStack>
  );
};