import { Card, ScrollView, Separator, Text, XStack, YStack } from "tamagui";
import { useRouter } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

// Dati fittizi per le carte più costose
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
    icon: "layers-outline",
    color: "#4CAF50",
  },
  {
    label: "Sealed",
    value: 0,
    icon: "cube-outline",
    color: "#00BFFF",
  },
  {
    label: "Graded",
    value: 0,
    icon: "star-outline",
    color: "#FFD700",
  },
];

// StatCard component
type StatCardProps = {
  icon: string;
  value: number;
  label: string;
  color: string;
};

const StatCard = ({ icon, value, label, color }: StatCardProps) => {
  return (
    <YStack
      style={{
        alignItems: "center",
        flex: 1,
        minWidth: 100,
        maxWidth: 120,
        width: "100%",
        borderRadius: 18,
        background: "var(--color2)",
        padding: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Ionicons
        name={icon as any}
        size={26}
        color={color}
        style={{
          marginBottom: 4,
          filter: `drop-shadow(0 2px 4px ${color}40)`,
        }}
      />
      <Text
        fontSize={22}
        fontWeight="900"
        style={{
          color,
          marginBottom: 2,
          filter: `drop-shadow(0 1px 4px ${color}40)`,
        }}
      >
        {value}
      </Text>
      <Text fontSize={14} style={{ opacity: 0.6 }}>
        {label}
      </Text>
    </YStack>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();

  // Valori demo
  const collectionValue = 107.99;
  const paidValue = 174.69;
  const percentageChange = -38.18;

  return (
    <YStack style={{ flex: 1, background: "var(--background)" }}>
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
              opacity={0.7}
              style={{ textAlign: "center", maxWidth: 400 }}
            >
              Statistiche, cards e valori sempre a portata di mano.
            </Text>
          </YStack>

          {/* VALORE COLLEZIONE */}
          <YStack
            style={{
              alignItems: "center",
              marginBottom: 32,
              borderRadius: 24,
              background: "var(--color2)",
              paddingTop: 32,
              paddingBottom: 32,
              maxWidth: 400,
              width: "100%",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Text fontSize={16} opacity={0.6} style={{ marginBottom: 8 }}>
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
              <Text fontSize={16} opacity={0.5}>
                Pagato €{paidValue.toFixed(2)}
              </Text>
              <Text
                fontWeight="700"
                fontSize={16}
                style={{
                  color:
                    percentageChange >= 0
                      ? "var(--green10)"
                      : "var(--red10)",
                }}
              >
                ({percentageChange.toFixed(2)}%)
              </Text>
            </XStack>
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
              <StatCard
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                color={stat.color}
              />
            ))}
          </XStack>

          {/* SEPARATORE */}
          <Separator
            style={{
              marginVertical: 18,
              backgroundColor: "var(--color2)",
              opacity: 0.1,
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
              <Text fontSize={18} fontWeight="700" opacity={0.9}>
                Top 5 Most Valuable
              </Text>
            </XStack>
            <YStack style={{ gap: 16 }}>
              {dummyExpensiveCards.map((card) => (
                <YStack
                  key={card.id}
                  style={{
                    padding: 12,
                    width: "100%",
                    borderRadius: 12,
                    background: "var(--color2)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                  hoverStyle={{ background: "var(--color3)" }}
                  pressStyle={{ background: "var(--color4)" }}
                  onPress={() => router.push(`/card/${card.id}`)}
                >
                  <XStack style={{ alignItems: "center", gap: 12 }}>
                    <Card
                      elevate
                      size="$4"
                      bordered
                      style={{
                        width: 60,
                        height: 84,
                        borderRadius: 6,
                        overflow: "hidden",
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      {card.smallImageUrl && (
                        <img
                          src={card.smallImageUrl}
                          alt={card.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Card>
                    <YStack style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        fontSize={16}
                        fontWeight="600"
                        style={{ marginBottom: 4 }}
                      >
                        {card.name}
                      </Text>
                      <Text
                        fontSize={18}
                        fontWeight="800"
                        style={{
                          background:
                            "linear-gradient(90deg, #ff6bcb 0%, #ffa800 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        €{card.price.toFixed(2)}
                      </Text>
                    </YStack>
                  </XStack>
                </YStack>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

export default HomeScreen;
