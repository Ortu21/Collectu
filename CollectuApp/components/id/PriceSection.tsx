import React from 'react';
import { YStack, Text } from 'tamagui';
import { PokemonPrice, PokemonPriceDetail } from '../../types/pokemon';
import { PriceTable } from '../id/PriceTable';
import { extractArray } from '../../utils/circularReferenceHandler';
import { getPlatformGlassmorphicStyle, glassmorphicSectionStyles } from '../../styles/glassmorphicStyles';

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

  const sectionGlassStyles = getPlatformGlassmorphicStyle(glassmorphicSectionStyles);

  return (
    <YStack style={{ ...sectionGlassStyles, padding: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>{title}</Text>
      <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>
        Updated: {prices.updatedAt}
      </Text>
      
      {priceDetails.map((detail, index) => (
        <YStack key={`price-${index}`} style={{ marginBottom: 16 }}>
          {detail.foilType && (
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#ddd', marginBottom: 8, textAlign: 'center' }}>{detail.foilType}</Text>
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