import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { glassmorphicCardStyles, getPlatformGlassmorphicStyle } from "../../styles/glassmorphicStyles";
import { PokemonCard } from "../../types/pokemon";

interface AttacksSectionProps {
  attacks: PokemonCard["attacks"];
  renderEnergyCost: (cost: string) => React.ReactNode;
}

export const AttacksSection: React.FC<AttacksSectionProps> = ({ attacks, renderEnergyCost }) => (
  <YStack style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}>
    <Text fontSize={24} fontWeight="bold" style={{ color: "#fff", backgroundColor: "rgba(44,62,80,0.8)", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>Attacks</Text>
    <YStack>
      {attacks && attacks.map((attack, idx) => (
        <YStack key={idx} style={{ padding: 16, gap: 8 }}>
          <XStack style={{ alignItems: "center", gap: 8 }}>
            {attack.cost && renderEnergyCost(attack.cost)}
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>{attack.name}</Text>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{attack.damage}</Text>
          </XStack>
          <Text style={{ color: "#ccc", fontSize: 14 }}>{attack.text}</Text>
        </YStack>
      ))}
    </YStack>
  </YStack>
);
