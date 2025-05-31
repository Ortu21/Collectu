import React from "react";
import { TextInput, TouchableOpacity, Platform } from "react-native";
import { YStack, XStack, Text, Image } from "tamagui";
import { PokemonSet } from "../../types/pokemon";
// Importa gli stili glassmorphic centralizzati
import {
  getPlatformGlassmorphicStyle,
  glassmorphicBarStyles,
  glassmorphicInputStyles,
  glassmorphicButtonStyles,
  glassmorphicSelectedItemStyles,
  glassmorphicClearButtonStyles,
} from "../../styles/glassmorphicStyles";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
  selectedSet: PokemonSet | null;
  onClearFilter: () => void;
  totalCount: number;
  isLoading: boolean;
}

export const SearchFilterBar = ({
  searchQuery,
  onSearchChange,
  onFilterPress,
  selectedSet,
  onClearFilter,
  totalCount,
  isLoading,
}: SearchFilterBarProps) => {
  // Ottieni gli stili glassmorphic per i vari elementi dalla centralizzazione
  const containerGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicBarStyles,
  );
  const inputGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicInputStyles,
  );
  const buttonGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicButtonStyles,
  );
  const selectedSetGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicSelectedItemStyles,
  );
  const clearButtonGlassStyles = getPlatformGlassmorphicStyle(
    glassmorphicClearButtonStyles,
  );

  return (
    // Applica gli stili glassmorphic centralizzati al contenitore principale
    <YStack
      style={{
        ...containerGlassStyles,
        padding: 16, // Mantieni padding specifici del layout
        // borderBottomWidth e borderBottomColor sono già inclusi in glassmorphicBarStyles
      }}
    >
      <XStack
        style={{
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {/* Applica gli stili glassmorphic centralizzati all'input */}
        <TextInput
          style={{
            flex: 1, // Mantieni flex per il layout
            padding: 12, // Mantieni padding specifici dell'input
            fontSize: 16, // Mantieni font size specifico
            color: "#fff", // Mantieni colore del testo
            ...inputGlassStyles, // Applica gli stili glassmorphic di base per l'input
          }}
          placeholder="Search cards..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </XStack>

      <XStack
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10, // Mantieni gap specifico
        }}
      >
        {/* Applica gli stili glassmorphic centralizzati al bottone Set */}
        <TouchableOpacity
          style={{
            padding: 12, // Mantieni padding specifici del bottone
            alignItems: "center",
            justifyContent: "center",
            width: 80, // Mantieni larghezza specifica
            ...buttonGlassStyles, // Applica gli stili glassmorphic di base per il bottone
            // borderRadius, borderWidth, borderColor, backdropFilter, boxShadow/elevation sono inclusi
          }}
          onPress={onFilterPress}
        >
          <Text
            color="#fff"
            fontSize={16}
            fontWeight="bold"
            style={{
              // Mantieni textShadow solo per web se necessario, altrimenti rimuovi la logica Platform.OS
              textShadowColor:
                Platform.OS === "web"
                  ? "rgba(0, 122, 255, 0.5)"
                  : "transparent",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            Set
          </Text>
        </TouchableOpacity>

        <YStack
          style={{
            height: 30, // Mantieni altezza specifica
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5, // Mantieni margin specifici
          }}
        >
          {totalCount > 0 && !isLoading && (
            <Text
              color="rgba(255, 255, 255, 0.7)"
              fontSize={13}
              fontWeight="500"
              style={{
                textAlign: "center",
                opacity: 0.9,
                textShadowColor: "rgba(255, 255, 255, 0.1)",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              Found {totalCount} card{totalCount !== 1 ? "s" : ""}
            </Text>
          )}
        </YStack>
      </XStack>

      {selectedSet && (
        // Applica gli stili glassmorphic centralizzati all'elemento del set selezionato
        <XStack
          style={{
            marginTop: 12, // Mantieni margin specifici
            padding: 12, // Mantieni padding specifici
            alignItems: "center",
            justifyContent: "space-between",
            ...selectedSetGlassStyles, // Applica gli stili glassmorphic di base per l'elemento selezionato
            // backgroundColor, borderWidth, borderColor, borderRadius, backdropFilter, boxShadow/elevation sono inclusi
          }}
        >
          <XStack
            style={{
              alignItems: "center",
              flex: 1,
            }}
          >
            <Image
              source={{ uri: selectedSet.logoUrl }}
              style={{
                width: 40,
                height: 40,
                marginRight: 12,
                borderRadius: 8,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
              resizeMode="contain"
            />
            <Text
              color="rgba(255, 255, 255, 0.9)"
              fontSize={14}
              fontWeight="bold"
              style={{
                textShadowColor: "rgba(255, 255, 255, 0.1)",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              {selectedSet.setName}
            </Text>
          </XStack>

          {/* Applica gli stili glassmorphic centralizzati al bottone Clear */}
          <TouchableOpacity
            style={{
              padding: 8, // Mantieni padding specifici
              alignItems: "center",
              justifyContent: "center",
              ...clearButtonGlassStyles, // Applica gli stili glassmorphic di base per il bottone clear
              // backgroundColor, borderWidth, borderColor, borderRadius, backdropFilter sono inclusi
            }}
            onPress={onClearFilter}
          >
            <Text
              color="rgba(255, 255, 255, 0.8)"
              fontSize={12}
              fontWeight="500"
              style={{
                textShadowColor: "rgba(255, 255, 255, 0.2)",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              }}
            >
              Clear
            </Text>
          </TouchableOpacity>
        </XStack>
      )}
    </YStack>
  );
};
