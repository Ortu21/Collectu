import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { PokemonCard } from "../../types/pokemon";

interface BattleAttributesSectionProps {
  weaknesses: PokemonCard["weaknesses"];
  resistances: PokemonCard["resistances"];
  getTypeColor: (type: string) => string;
}

export const BattleAttributesSection: React.FC<BattleAttributesSectionProps> = ({ weaknesses, resistances, getTypeColor }) => (
  <YStack style={{ backgroundColor: 'var(--backgroundStrong)', borderRadius: 16, overflow: 'hidden' }}>
    <Text fontSize={24} fontWeight="bold" style={{ color: 'var(--color1)', backgroundColor: 'var(--background)', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>Battle Attributes</Text>
    <XStack style={{ gap: 24 }}>
      <YStack flex={1} style={{ backgroundColor: 'var(--background)', padding: 16, borderRadius: 12 }}>
        <Text style={{ color: 'var(--color1)', fontWeight: 'bold' }}>Weaknesses</Text>
        {weaknesses && weaknesses.length > 0 ? (
          weaknesses.map((w, i) => (
            <XStack key={i} style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ color: getTypeColor(w.type), fontWeight: 'bold' }}>{w.type}</Text>
              <Text style={{ color: 'var(--color1)' }}>x{w.value}</Text>
            </XStack>
          ))
        ) : (
          <Text style={{ color: 'var(--color7)' }}>-</Text>
        )}
      </YStack>
      <YStack flex={1} style={{ backgroundColor: 'var(--background)', padding: 16, borderRadius: 12 }}>
        <Text style={{ color: 'var(--color1)', fontWeight: 'bold' }}>Resistances</Text>
        {resistances && resistances.length > 0 ? (
          resistances.map((r, i) => (
            <XStack key={i} style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ color: getTypeColor(r.type), fontWeight: 'bold' }}>{r.type}</Text>
              <Text style={{ color: 'var(--color1)' }}>x{r.value}</Text>
            </XStack>
          ))
        ) : (
          <Text style={{ color: 'var(--color7)' }}>-</Text>
        )}
      </YStack>
    </XStack>
  </YStack>
);
