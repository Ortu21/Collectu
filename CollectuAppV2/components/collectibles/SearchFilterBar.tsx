import React from "react";
import { TouchableOpacity } from "react-native";
import { YStack, XStack, Text, Image, Input, useTheme } from "tamagui";
import { PokemonSet } from "../../types/pokemon";

// Utility per estrarre sempre una stringa colore
function getColor(token: any, fallback?: string) {
  if (!token) return fallback || undefined;
  if (typeof token === "string") return token;
  if (typeof token === "object" && typeof token.val === "string")
    return token.val;
  return fallback || undefined;
}

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
  const theme = useTheme();
  const bg = getColor(theme.background, "#fff");
  const strongBg = getColor(theme.backgroundStrong, "#f5f5f5");
  const border = getColor(theme.borderColor, "#e0e0e0");
  const color = getColor(theme.color, "#222");
  const color1 = getColor(theme.color1, "#111");
  const color6 = getColor(theme.color6, "#888");
  const color7 = getColor(theme.color7, "#666");
  const focus = getColor(theme.colorFocus, "#555");
  const accent = getColor(theme.accent10, "#6c47ff");

  return (
    <YStack backgroundColor={bg} padding={16} borderRadius={12}>
      <XStack alignItems="center" marginBottom={10}>
        <Input
          style={{ flex: 1, padding: 12 }}
          placeholder="Search cards..."
          placeholderTextColor={color6}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </XStack>

      <XStack alignItems="center" justifyContent="space-between" gap={10}>
        <TouchableOpacity onPress={onFilterPress}>
          <Text color={accent} fontSize={16} fontWeight="bold">
            Set
          </Text>
        </TouchableOpacity>

        <YStack
          height={30}
          justifyContent="center"
          alignItems="center"
          marginTop={5}
        >
          {totalCount > 0 && !isLoading && (
            <Text
              color={color7}
              fontSize={13}
              fontWeight="500"
              textAlign="center"
              opacity={0.9}
            >
              Found {totalCount} card{totalCount !== 1 ? "s" : ""}
            </Text>
          )}
        </YStack>
      </XStack>

      {selectedSet && (
        <XStack
          marginTop={12}
          padding={12}
          alignItems="center"
          justifyContent="space-between"
          backgroundColor={strongBg}
          borderRadius={12}
          borderWidth={1}
          borderColor={border}
        >
          <XStack alignItems="center" flex={1}>
            <Image
              source={{ uri: selectedSet.logoUrl }}
              style={{
                width: 40,
                height: 40,
                marginRight: 12,
                borderRadius: 8,
                backgroundColor: bg,
                borderWidth: 1,
                borderColor: border,
              }}
              resizeMode="contain"
            />
            <Text color={color1} fontSize={14} fontWeight="bold">
              {selectedSet.setName}
            </Text>
          </XStack>

          <TouchableOpacity
            style={{
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: bg,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: border,
            }}
            onPress={onClearFilter}
          >
            <Text color={color7} fontSize={12} fontWeight="500">
              Clear
            </Text>
          </TouchableOpacity>
        </XStack>
      )}
    </YStack>
  );
};
