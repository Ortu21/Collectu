import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { getPlatformGlassmorphicStyle, glassmorphicCardStyles } from '../../styles/glassmorphicStyles';
import { PokemonPriceDetail } from '../../types/pokemon';

type PriceTableProps = {
  priceDetail: PokemonPriceDetail;
  formatPrice: (price: number | undefined | null) => string;
};

export const PriceTable = ({ priceDetail, formatPrice }: PriceTableProps) => {
  const isCardMarket = priceDetail.averageSellPrice !== undefined || 
    priceDetail.trendPrice !== undefined || 
    priceDetail.suggestedPrice !== undefined;

  const cardGlassStyles = getPlatformGlassmorphicStyle(glassmorphicCardStyles);

  return (
    <YStack style={{ ...cardGlassStyles, marginTop: 8, padding: 8 }}>
      {isCardMarket ? (
        <XStack style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          {priceDetail.averageSellPrice && (
            <YStack style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>Avg Sell</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                {formatPrice(priceDetail.averageSellPrice)}
              </Text>
            </YStack>
          )}
          {priceDetail.trendPrice && (
            <YStack style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>Trend</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                {formatPrice(priceDetail.trendPrice)}
              </Text>
            </YStack>
          )}
          {priceDetail.low && (
            <YStack style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>Low</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
                {formatPrice(priceDetail.low)}
              </Text>
            </YStack>
          )}
        </XStack>
      ) : (
        <>
          <XStack style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            {priceDetail.low && (
              <YStack style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>Low</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{formatPrice(priceDetail.low)}</Text>
              </YStack>
            )}
            {priceDetail.mid && (
              <YStack style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>Mid</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{formatPrice(priceDetail.mid)}</Text>
              </YStack>
            )}
            {priceDetail.high && (
              <YStack style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>High</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{formatPrice(priceDetail.high)}</Text>
              </YStack>
            )}
          </XStack>
          <XStack style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            {priceDetail.market && (
              <YStack style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>Market</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{formatPrice(priceDetail.market)}</Text>
              </YStack>
            )}
            {priceDetail.directLow !== undefined && priceDetail.directLow !== null && (
              <YStack style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>Direct Low</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{formatPrice(priceDetail.directLow)}</Text>
              </YStack>
            )}
          </XStack>
        </>
      )}
    </YStack>
  );
};