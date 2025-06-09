import React, { useState } from 'react';
import { YStack, XStack, Text, Input } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

const qualities = [
  { label: 'Mint', value: 'mint' },
  { label: 'Near Mint', value: 'near_mint' },
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Played', value: 'played' },
  { label: 'Poor', value: 'poor' },
];

export type CardActionProps = {
  onAdd: (qty: number, quality: string) => void;
  onRemove: (qty: number, quality: string) => void;
  disabled?: boolean;
};

export const CardAction = ({ onAdd, onRemove, disabled }: CardActionProps) => {
  const [qty, setQty] = useState(1);
  const [quality, setQuality] = useState('mint');

  const handleQtyChange = (text: string) => {
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    setQty(isNaN(num) ? 1 : Math.max(1, num));
  };

  return (
    <YStack style={{ backgroundColor: 'var(--backgroundStrong)', borderRadius: 16, marginVertical: 16, marginHorizontal: 12, padding: 16 }}>
      <XStack style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: 'var(--color1)', fontWeight: 'bold', fontSize: 16, width: 80 }}>Quantità</Text>
        <Input
          value={qty.toString()}
          onChangeText={handleQtyChange}
          keyboardType="numeric"
          editable={!disabled}
          style={{ backgroundColor: 'var(--background)', color: 'var(--color1)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, flex: 1, marginLeft: 8 }}
        />
      </XStack>
      <XStack style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ color: 'var(--color1)', fontWeight: 'bold', fontSize: 16, width: 80 }}>Qualità</Text>
        <XStack style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 8, flex: 1 }}>
          {qualities.map((q) => (
            <YStack
              key={q.value}
              onPress={() => !disabled && setQuality(q.value)}
              style={{
                backgroundColor: quality === q.value ? 'var(--color5)' : 'var(--background)',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginRight: 8,
                marginBottom: 4,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <Text style={{ color: quality === q.value ? 'var(--color1)' : 'var(--color7)', fontSize: 14, fontWeight: quality === q.value ? 'bold' : 'normal' }}>{q.label}</Text>
            </YStack>
          ))}
        </XStack>
      </XStack>
      <XStack style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <YStack
          onPress={() => !disabled && onAdd(qty, quality)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 18, marginHorizontal: 4, backgroundColor: 'var(--color6)', opacity: disabled ? 0.5 : 1, borderRadius: 8 }}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Aggiungi</Text>
        </YStack>
        <YStack
          onPress={() => !disabled && onRemove(qty, quality)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 18, marginHorizontal: 4, backgroundColor: 'var(--color7)', opacity: disabled ? 0.5 : 1, borderRadius: 8 }}
        >
          <Ionicons name="remove-circle" size={22} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 }}>Rimuovi</Text>
        </YStack>
      </XStack>
    </YStack>
  );
};
