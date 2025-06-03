import React from "react";
import { YStack, XStack, Text, Card } from "tamagui";
import { glassmorphicCardStyles, getPlatformGlassmorphicStyle } from "../../styles/glassmorphicStyles";
import { PokemonCard } from "../../types/pokemon";

interface CardInformationSectionProps {
  card: PokemonCard;
}

export const CardInformationSection: React.FC<CardInformationSectionProps> = ({ card }) => (
  <YStack style={getPlatformGlassmorphicStyle(glassmorphicCardStyles)}>
    <XStack style={{ alignItems: "center", gap: 12 }}>
      <Card style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 8, width: 140 }}>
        <Text>Set</Text>
      </Card>
      <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>{card.setName || "Unknown"}</Text>
    </XStack>
    <XStack style={{ alignItems: "center", gap: 12 }}>
      <Card style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 8, width: 140 }}>
        <Text>Number</Text>
      </Card>
      <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>{card.number || "-"}</Text>
    </XStack>
    <XStack style={{ alignItems: "center", gap: 12 }}>
      <Card style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 8, width: 140 }}>
        <Text>Rarity</Text>
      </Card>
      <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>{card.rarity || "-"}</Text>
    </XStack>
    <XStack style={{ alignItems: "center", gap: 12 }}>
      <Card style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 8, width: 140 }}>
        <Text>Types</Text>
      </Card>
      <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>{Array.isArray(card.supertype) ? card.supertype.join(", ") : "-"}</Text>
    </XStack>
    {card.evolvesFrom && (
      <XStack style={{ alignItems: "center", gap: 12 }}>
        <Card style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 8, width: 140 }}>
          <Text>Evolves From</Text>
        </Card>
        <Text style={{ color: "#fff", fontSize: 16, flex: 1 }}>Evolves from {card.evolvesFrom}</Text>
      </XStack>
    )}
  </YStack>
);
