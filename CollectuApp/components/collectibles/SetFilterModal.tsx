import React from "react";
import { Modal, TouchableOpacity, ScrollView, Platform } from "react-native";
import { YStack, XStack, Text, Card, Image, Spinner } from "tamagui";
import { PokemonSet } from "../../types/pokemon";
// Importa gli stili glassmorphic centralizzati
import {
  getPlatformGlassmorphicStyle,
  glassmorphicModalOverlayStyles,
  glassmorphicModalContentStyles,
  glassmorphicLoadingStyles,
  glassmorphicSetItemStyles,
} from "../../styles/glassmorphicStyles";

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
  // Ottieni gli stili glassmorphic per i vari elementi dalla centralizzazione
  const modalOverlayGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicModalOverlayStyles,
  );
  const modalContentGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicModalContentStyles,
  );
  const loadingGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicLoadingStyles,
  );
  const setItemGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicSetItemStyles,
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Applica gli stili glassmorphic centralizzati all'overlay della modale */}
      <YStack
        flex={1}
        style={modalOverlayGlassStyles} // Applica gli stili glassmorphic di base per l'overlay
      >
        {/* Background overlay decorativo con blur (rimane separato se ha logiche diverse) */}
        <YStack
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
            ...(Platform.OS === "web" && {
              background:
                "radial-gradient(circle at 30% 40%, rgba(255, 107, 203, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(76, 175, 80, 0.2) 0%, transparent 50%)",
            }),
          }}
        />

        {/* Spacer per spingere il contenuto in basso */}
        <YStack flex={1} onPress={onClose} />

        {/* Applica gli stili glassmorphic centralizzati al contenitore del contenuto della modale */}
        <Card
          style={{
            padding: 24, // Mantieni padding specifici del layout
            height: "75%", // Mantieni altezza specifica
            margin: 0, // Mantieni margin specifico
            ...modalContentGlassStyles, // Applica gli stili glassmorphic di base per il contenuto modale
            // backgroundColor, borderWidth, borderColor, borderTopLeftRadius, borderTopRightRadius, backdropFilter, boxShadow/elevation sono inclusi
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
              color="rgba(255, 255, 255, 0.95)"
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
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: 20,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.15)",
                ...(Platform.OS === "web" && {
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }),
              }}
            >
              <Text
                fontSize={18}
                color="rgba(255, 255, 255, 0.8)"
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
              {/* Applica gli stili glassmorphic centralizzati all'indicatore di caricamento */}
              <YStack
                style={{
                  padding: 24, // Mantieni padding specifici
                  alignItems: "center",
                  ...loadingGlassStyles, // Applica gli stili glassmorphic di base per il caricamento
                  // backgroundColor, borderWidth, borderColor, borderRadius, backdropFilter, boxShadow/elevation sono inclusi
                }}
              >
                <Spinner size="large" color="rgba(0, 122, 255, 0.8)" />
                <Text
                  color="rgba(255, 255, 255, 0.7)"
                  fontSize={16}
                  style={{
                    marginTop: 16,
                    // Mantieni textShadow solo per web se necessario
                    textShadowColor:
                      Platform.OS === "web"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "transparent",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 8,
                  }}
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
              {/* Applica gli stili glassmorphic centralizzati per lo stato vuoto (riutilizza loading) */}
              <YStack
                style={{
                  padding: 24, // Mantieni padding specifici
                  alignItems: "center",
                  ...loadingGlassStyles, // Utilizza gli stessi stili di caricamento per lo stato vuoto per consistenza visiva
                }}
              >
                <Text
                  fontSize={20}
                  fontWeight="bold"
                  color="rgba(255, 255, 255, 0.9)"
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
                  color="rgba(255, 255, 255, 0.6)"
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
                    {/* Applica gli stili glassmorphic centralizzati agli item del set */}
                    <Card
                      style={{
                        flexDirection: "row" as const, // Mantieni direzione layout
                        alignItems: "center" as const, // Mantieni allineamento
                        padding: 16, // Mantieni padding specifici
                        ...setItemGlassStyles, // Applica gli stili glassmorphic di base per l'item del set
                        // backgroundColor, borderWidth, borderColor, borderRadius, backdropFilter, boxShadow/elevation sono inclusi
                      }}
                    >
                      <YStack
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderRadius: 12,
                          padding: 8,
                          marginRight: 16,
                          borderWidth: 1,
                          borderColor: "rgba(255, 255, 255, 0.1)",
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
                          color="rgba(255, 255, 255, 0.95)"
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
                          color="rgba(255, 255, 255, 0.6)"
                          fontSize={14}
                          style={{ marginBottom: 2 }}
                        >
                          {set.series}
                        </Text>
                        <Text color="rgba(255, 255, 255, 0.5)" fontSize={12}>
                          {set.releaseDate}
                        </Text>
                      </YStack>

                      {/* Chevron indicator (rimane invariato) */}
                      <YStack
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderRadius: 8,
                          padding: 6,
                          marginLeft: 8,
                        }}
                      >
                        <Text color="rgba(255, 255, 255, 0.4)" fontSize={16}>
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
