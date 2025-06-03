import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  Image,
  Theme,
  Separator,
  ScrollView,
} from "tamagui";

// Dati fittizi per le carte più costose (mantenuti per esempio)
const dummyExpensiveCards = [
  {
    id: "1",
    name: "Charizard VMAX",
    price: 120.5,
    smallImageUrl: "https://images.pokemontcg.io/swsh35/19_hires.png",
  },
  {
    id: "2",
    name: "Pikachu Illustrator",
    price: 900000.0,
    smallImageUrl: "https://images.pokemontcg.io/si1/1_hires.png",
  },
  {
    id: "3",
    name: "Blastoise #009/165R",
    price: 85.0,
    smallImageUrl: "https://images.pokemontcg.io/xy12/12_hires.png",
  },
  {
    id: "4",
    name: "Umbreon Gold Star",
    price: 70000.0,
    smallImageUrl: "https://images.pokemontcg.io/pop5/17_hires.png",
  },
  {
    id: "5",
    name: "Lugia Neo Genesis",
    price: 144000.0,
    smallImageUrl: "https://images.pokemontcg.io/neo1/9_hires.png",
  },
];

const stats = [
  {
    label: "Ungraded",
    value: 33,
    icon: "layers-outline" as const,
    color: "#4CAF50",
  },
  {
    label: "Sealed",
    value: 0,
    icon: "cube-outline" as const,
    color: "#00BFFF",
  },
  {
    label: "Graded",
    value: 0,
    icon: "star-outline" as const,
    color: "#FFD700",
  },
];

const HomeScreen = () => {
  const router = useRouter();

  const collectionValue = 107.99;
  const paidValue = 174.69;
  const percentageChange = -38.18;

  const glassCardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  };

  const glassStatsCardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(15px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.2)",
  };

  const glassListCardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(18px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    boxShadow: "0 6px 24px 0 rgba(0, 0, 0, 0.25)",
  };

  return (
    <Theme name="dark">
      <YStack
        flex={1}
        style={{
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 70%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 70%)",
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack
            style={{
              paddingHorizontal: 20,
              paddingTop: 32,
              paddingBottom: 32,
              width: "90%",
              maxWidth: 1200,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {/* HEADER */}
            <YStack style={{ alignItems: "center", marginBottom: 32 }}>
              <Text
                fontSize={36}
                fontWeight="900"
                style={{
                  textAlign: "center",
                  letterSpacing: 0.5,
                  lineHeight: 44,
                  background:
                    "linear-gradient(90deg, #ff6bcb, #ffa800 60%, #4CAF50 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 8,
                  filter: "drop-shadow(0 2px 8px rgba(255, 107, 203, 0.3))",
                }}
              >
                Collectu
              </Text>
              <Text
                fontSize={15}
                color="rgba(255, 255, 255, 0.7)"
                style={{ textAlign: "center", maxWidth: 400 }}
              >
                Statistiche, cards e valori sempre a portata di mano.
              </Text>
            </YStack>

            {/* VALORE COLLEZIONE */}
            <YStack style={{ alignItems: "center", marginBottom: 32 }}>
              <Card
                elevate
                borderRadius={24}
                padded
                style={{
                  ...glassCardStyle,
                  alignItems: "center",
                  paddingVertical: 32,
                  maxWidth: 400,
                  width: "100%",
                }}
              >
                <Text
                  fontSize={16}
                  color="rgba(255, 255, 255, 0.6)"
                  style={{ marginBottom: 8 }}
                >
                  Valore collezione
                </Text>
                <Text
                  fontSize={40}
                  fontWeight="900"
                  style={{
                    background:
                      "linear-gradient(90deg, #ff6bcb, #ffa800 60%, #4CAF50 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 10,
                    letterSpacing: 0.5,
                    filter: "drop-shadow(0 2px 8px rgba(255, 168, 0, 0.2))",
                  }}
                >
                  €{collectionValue.toFixed(2)}
                </Text>
                <XStack style={{ alignItems: "center", gap: 8 }}>
                  <Text color="rgba(255, 255, 255, 0.5)" fontSize={16}>
                    Pagato €{paidValue.toFixed(2)}
                  </Text>
                  <Text
                    color={percentageChange >= 0 ? "#4CAF50" : "#FF3B30"}
                    fontWeight="700"
                    fontSize={16}
                  >
                    ({percentageChange.toFixed(2)}%)
                  </Text>
                </XStack>
              </Card>
            </YStack>

            {/* STATISTICHE */}
            <XStack
              style={{
                justifyContent: "center",
                gap: 16,
                marginBottom: 36,
              }}
            >
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  elevate
                  borderRadius={18}
                  padded
                  style={{
                    ...glassStatsCardStyle,
                    alignItems: "center",
                    flex: 1,
                    minWidth: 100,
                    maxWidth: 120,
                    width: "100%",
                  }}
                >
                  <Ionicons
                    name={stat.icon}
                    size={26}
                    color={stat.color}
                    style={{
                      marginBottom: 4,
                      filter: `drop-shadow(0 2px 4px ${stat.color}40)`,
                    }}
                  />
                  <Text
                    fontSize={22}
                    fontWeight="900"
                    style={{
                      color: stat.color,
                      marginBottom: 2,
                      filter: `drop-shadow(0 1px 4px ${stat.color}40)`,
                    }}
                  >
                    {stat.value}
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.6)" fontSize={14}>
                    {stat.label}
                  </Text>
                </Card>
              ))}
            </XStack>

            {/* SEPARATORE */}
            <Separator
              style={{
                marginVertical: 18,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            />

            {/* TOP 5 */}
            <YStack style={{ marginTop: 12 }}>
              <XStack
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text
                  fontSize={18}
                  color="rgba(255, 255, 255, 0.9)"
                  fontWeight="700"
                >
                  Top 5 Most Valuable
                </Text>
                <Button
                  size="$2"
                  chromeless
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 12,
                  }}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={22}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                </Button>
              </XStack>
              <YStack style={{ gap: 16 }}>
                {dummyExpensiveCards.map((card) => (
                  <Card
                    key={card.id}
                    borderRadius={14}
                    elevate
                    pressStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "scale(0.98)",
                    }}
                    hoverStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    }}
                    style={{
                      ...glassListCardStyle,
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 0,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minHeight: 110,
                    }}
                    onPress={() => router.push(`/card/${card.id}`)}
                  >
                    <YStack
                      style={{
                        width: 86,
                        height: 116,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 12,
                        marginRight: 20,
                        borderWidth: 1,
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <Image
                        source={{ uri: card.smallImageUrl }}
                        style={{
                          width: 80,
                          height: 110,
                          borderRadius: 8,
                          backgroundColor: "rgba(255, 255, 255, 0.02)",
                        }}
                        resizeMode="cover"
                      />
                    </YStack>
                    <YStack style={{ flex: 1, justifyContent: "center" }}>
                      <Text
                        color="rgba(255, 255, 255, 0.95)"
                        fontSize={18}
                        fontWeight="700"
                        style={{ marginBottom: 2 }}
                      >
                        {card.name}
                      </Text>
                      <Text
                        color="#4CAF50"
                        fontSize={17}
                        fontWeight="700"
                        style={{
                          filter:
                            "drop-shadow(0 1px 4px rgba(76, 175, 80, 0.3))",
                        }}
                      >
                        €{card.price.toFixed(2)}
                      </Text>
                    </YStack>
                    <Ionicons
                      name="chevron-forward"
                      size={22}
                      color="rgba(255, 255, 255, 0.4)"
                    />
                  </Card>
                ))}
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
};

export default HomeScreen;
