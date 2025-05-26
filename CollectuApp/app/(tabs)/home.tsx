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

  return (
    <Theme name="dark">
      <YStack flex={1} style={{ backgroundColor: "#101014" }}>
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
                }}
              >
                La tua collezione
              </Text>
              <Text
                fontSize={15}
                color="#aaa"
                style={{ textAlign: "center", maxWidth: 340 }}
              >
                Statistiche, cards e valore sempre a portata di mano.
              </Text>
            </YStack>

            {/* VALORE COLLEZIONE */}
            <Card
              elevate
              backgroundColor="#18181b"
              borderRadius={24}
              style={{
                alignItems: "center",
                paddingVertical: 32,
                marginBottom: 32,
                boxShadow: "0 4px 32px 0 #0004",
              }}
            >
              <Text fontSize={16} color="#aaa" style={{ marginBottom: 8 }}>
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
                }}
              >
                €{collectionValue.toFixed(2)}
              </Text>
              <XStack style={{ alignItems: "center", gap: 8 }}>
                <Text color="#999" fontSize={16}>
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
                  backgroundColor="#18181b"
                  borderRadius={18}
                  padded
                  style={{
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
                    style={{ marginBottom: 4 }}
                  />
                  <Text
                    fontSize={22}
                    fontWeight="900"
                    style={{ color: stat.color, marginBottom: 2 }}
                  >
                    {stat.value}
                  </Text>
                  <Text color="#aaa" fontSize={14}>
                    {stat.label}
                  </Text>
                </Card>
              ))}
            </XStack>

            {/* SEPARATORE */}
            <Separator style={{ marginVertical: 18 }} />

            {/* TOP 5 */}
            <YStack style={{ marginTop: 12 }}>
              <XStack
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text fontSize={18} color="#fff" fontWeight="700">
                  Top 5 Most Valuable
                </Text>
                <Button size="$2" chromeless>
                  <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
                </Button>
              </XStack>
              <YStack style={{ gap: 16 }}>
                {dummyExpensiveCards.map((card) => (
                  <Card
                    key={card.id}
                    backgroundColor="#18181b"
                    borderRadius={14}
                    elevate
                    pressStyle={{ backgroundColor: "#23232b" }}
                    hoverStyle={{ backgroundColor: "#23232b" }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 0,
                      cursor: "pointer",
                      transition: "background 0.2s",
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
                        backgroundColor: "#23232b",
                        borderRadius: 12,
                        marginRight: 20,
                        borderWidth: 2,
                        borderColor: "#fff2",
                        boxShadow: "0 2px 12px 0 #0006",
                      }}
                    >
                      <Image
                        source={{ uri: card.smallImageUrl }}
                        style={{
                          width: 80,
                          height: 110,
                          borderRadius: 8,
                          backgroundColor: "#222",
                        }}
                        resizeMode="cover"
                      />
                    </YStack>
                    <YStack style={{ flex: 1, justifyContent: "center" }}>
                      <Text
                        color="#fff"
                        fontSize={18}
                        fontWeight="700"
                        style={{ marginBottom: 2 }}
                      >
                        {card.name}
                      </Text>
                      <Text color="#4CAF50" fontSize={17} fontWeight="700">
                        €{card.price.toFixed(2)}
                      </Text>
                    </YStack>
                    <Ionicons name="chevron-forward" size={22} color="#666" />
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
