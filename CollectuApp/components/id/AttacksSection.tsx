import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { PokemonCard } from "../../types/pokemon";

interface AttacksSectionProps {
  attacks: PokemonCard["attacks"];
  renderEnergyCost: (cost: string) => React.ReactNode;
}

export const AttacksSection: React.FC<AttacksSectionProps> = ({ attacks, renderEnergyCost }) => (
  <YStack style={{ backgroundColor: 'var(--backgroundStrong)', borderRadius: 16, overflow: 'hidden' }}>
    <Text fontSize={24} fontWeight="bold" style={{ color: 'var(--color1)', backgroundColor: 'var(--background)', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>Attacks</Text>
    <YStack>
      {attacks && attacks.map((attack, idx) => (
        <YStack key={idx} style={{ padding: 16, gap: 8 }}>
          <XStack style={{ alignItems: 'center', gap: 8 }}>
            {attack.cost && renderEnergyCost(attack.cost)}
            <Text style={{ color: 'var(--color1)', fontWeight: 'bold', fontSize: 18 }}>{attack.name}</Text>
            <Text style={{ color: 'var(--color1)', fontWeight: 'bold', fontSize: 16 }}>{attack.damage}</Text>
          </XStack>
          <Text style={{ color: 'var(--color7)', fontSize: 14 }}>{attack.text}</Text>
        </YStack>
      ))}
    </YStack>
  </YStack>
);
