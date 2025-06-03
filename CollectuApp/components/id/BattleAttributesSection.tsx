import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { glassmorphicCardStyles, getPlatformGlassmorphicStyle } from "../../styles/glassmorphicStyles";
import { PokemonCard } from "../../types/pokemon";

interface BattleAttributesSectionProps {
  weaknesses: PokemonCard["weaknesses"];
  resistances: PokemonCard["resistances"];
  getTypeColor: (type: string) => string;
}

export const BattleAttributesSection: React.FC<BattleAttributesSectionProps> = ({ weaknesses, resistances, getTypeColor }) => (
  <YStack style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}>
    <Text fontSize={24} fontWeight="bold" style={{ color: "#fff", backgroundColor: "rgba(44,62,80,0.8)", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>Battle Attributes</Text>
    <XStack gap={24}>
      <YStack flex={1} style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Weaknesses</Text>
        {weaknesses && weaknesses.length > 0 ? (
          weaknesses.map((w, i) => (
            <XStack key={i} style={{ alignItems: "center", gap: 8 }}>
              <Text style={{ color: getTypeColor(w.type), fontWeight: "bold" }}>{w.type}</Text>
              <Text style={{ color: "#fff" }}>x{w.value}</Text>
            </XStack>
          ))
        ) : (
          <Text style={{ color: "#ccc" }}>-</Text>
        )}
      </YStack>
      <YStack flex={1} style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12 }}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Resistances</Text>
        {resistances && resistances.length > 0 ? (
          resistances.map((r, i) => (
            <XStack key={i} style={{ alignItems: "center", gap: 8 }}>
              <Text style={{ color: getTypeColor(r.type), fontWeight: "bold" }}>{r.type}</Text>
              <Text style={{ color: "#fff" }}>x{r.value}</Text>
            </XStack>
          ))
        ) : (
          <Text style={{ color: "#ccc" }}>-</Text>
        )}
      </YStack>
    </XStack>
  </YStack>
);
