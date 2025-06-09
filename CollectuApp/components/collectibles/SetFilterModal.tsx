import React from "react";
import { Modal, TouchableOpacity, ScrollView, Platform } from "react-native";
import { YStack, XStack, Text, Card, Image, Spinner } from "tamagui";
import { PokemonSet } from "../../types/pokemon";

interface SetFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  sets: PokemonSet[];
  isLoading: boolean;
  onSelectSet: (set: PokemonSet) => void;
}

export const SetFilterModal = ({
  isVisible,
  onClose,
  sets,
  isLoading,
  onSelectSet,
}: SetFilterModalProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <YStack flex={1} style={{ background: "rgba(0,0,0,0.4)" }}>
        <YStack style={{ flex: 1 }} onPress={onClose} />
        <Card
          style={{
            padding: 24,
            height: "75%",
            margin: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            background: "var(--color2)",
            boxShadow: "0 2px 24px rgba(0,0,0,0.18)",
            borderWidth: 1,
            borderColor: "var(--color3)",
          }}
        >
          <XStack
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Text
              fontSize={22}
              fontWeight="bold"
              color="var(--color)"
              style={{
                // Mantieni textShadow solo per web se necessario
                textShadowColor:
                  Platform.OS === "web"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 12,
              }}
            >
              Select a Set
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                borderRadius: 20,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Text
                fontSize={18}
                color="var(--color)"
                style={{
                  fontWeight: "300",
                  // Mantieni textShadow solo per web se necessario
                  textShadowColor:
                    Platform.OS === "web"
                      ? "rgba(255, 255, 255, 0.3)"
                      : "transparent",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </XStack>

          {isLoading ? (
            <YStack
              flex={1}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <YStack
                style={{
                  padding: 24,
                  alignItems: "center",
                  background: "var(--color3)",
                  borderRadius: 16,
                }}
              >
                <Spinner size="large" color="var(--accent10)" />
                <Text
                  color="var(--color)"
                  fontSize={16}
                  style={{ marginTop: 16 }}
                >
                  Loading sets...
                </Text>
              </YStack>
            </YStack>
          ) : sets.length === 0 ? (
            <YStack
              flex={1}
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <YStack
                style={{
                  padding: 24,
                  alignItems: "center",
                  background: "var(--color3)",
                  borderRadius: 16,
                }}
              >
                <Text
                  fontSize={20}
                  fontWeight="bold"
                  color="var(--color)"
                  style={{
                    textAlign: "center",
                    marginBottom: 12,
                    // Mantieni textShadow solo per web se necessario
                    textShadowColor:
                      Platform.OS === "web"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "transparent",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 12,
                  }}
                >
                  No sets available
                </Text>
                <Text
                  fontSize={14}
                  color="var(--color2)"
                  style={{ textAlign: "center" }}
                >
                  Please try again later
                </Text>
              </YStack>
            </YStack>
          ) : (
            <ScrollView
              style={{
                flex: 1,
                marginHorizontal: -8,
              }}
              showsVerticalScrollIndicator={false}
            >
              <YStack style={{ gap: 12, paddingHorizontal: 8 }}>
                {sets.map((set) => (
                  <TouchableOpacity
                    key={set.setId}
                    onPress={() => onSelectSet(set)}
                  >
                    <Card
                      style={{
                        flexDirection: "row" as const, // Mantieni direzione layout
                        alignItems: "center" as const, // Mantieni allineamento
                        padding: 16, // Mantieni padding specifici
                        background: "var(--color3)",
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: "var(--color4)",
                      }}
                    >
                      <YStack
                        style={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderRadius: 12,
                          padding: 8,
                          marginRight: 16,
                          borderWidth: 1,
                          borderColor: "rgba(255,255,255,0.1)",
                        }}
                      >
                        <Image
                          source={{ uri: set.logoUrl }}
                          style={{
                            width: 52,
                            height: 52,
                          }}
                          resizeMode="contain"
                        />
                      </YStack>

                      <YStack style={{ flex: 1 }}>
                        <Text
                          color="var(--color)"
                          fontSize={16}
                          fontWeight="bold"
                          style={{
                            marginBottom: 4,
                            // Mantieni textShadow solo per web se necessario
                            textShadowColor:
                              Platform.OS === "web"
                                ? "rgba(255, 255, 255, 0.1)"
                                : "transparent",
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: 8,
                          }}
                        >
                          {set.setName}
                        </Text>
                        <Text
                          color="var(--color2)"
                          fontSize={14}
                          style={{ marginBottom: 2 }}
                        >
                          {set.series}
                        </Text>
                        <Text color="var(--color3)" fontSize={12}>
                          {set.releaseDate}
                        </Text>
                      </YStack>

                      {/* Chevron indicator (rimane invariato) */}
                      <YStack
                        style={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderRadius: 8,
                          padding: 6,
                          marginLeft: 8,
                        }}
                      >
                        <Text color="var(--color2)" fontSize={16}>
                          ›
                        </Text>
                      </YStack>
                    </Card>
                  </TouchableOpacity>
                ))}
              </YStack>
            </ScrollView>
          )}
        </Card>
      </YStack>
    </Modal>
  );
};
