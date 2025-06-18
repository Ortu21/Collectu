import React from "react";
import { TouchableOpacity } from "react-native";
import { YStack, XStack, Text, Image, Input, useTheme } from "tamagui";
import { PokemonSet } from "../../types/pokemon";

// Utility per estrarre sempre una stringa colore dal token Tamagui
const getColor = (token: any) =>
  typeof token === "string" ? token : token?.val;

const useSearchBarTheme = (theme: any) => ({
  bg: getColor(theme.background),
  chipBg: getColor(theme.green8),
  chipBgHover: getColor(theme.green10),
  border: getColor(theme.borderColor),
  color: getColor(theme.color),
  color1: getColor(theme.color1),
  color6: getColor(theme.color6),
  color7: getColor(theme.color7),
  color10: getColor(theme.color10),
  focus: getColor(theme.colorFocus),
  accent: getColor(theme.accent10),
});

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
  const theme = useSearchBarTheme(useTheme());

  return (
    <YStack backgroundColor={theme.bg} padding={16} borderRadius={12}>
      <XStack alignItems="center" marginBottom={10}>
        <Input
          style={{ flex: 1, padding: 12 }}
          placeholder="Search cards..."
          placeholderTextColor={theme.color6}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </XStack>

      <XStack alignItems="center" justifyContent="space-between" gap={10}>
        <TouchableOpacity onPress={onFilterPress}>
          <Text color={theme.accent} fontSize={16} fontWeight="bold">
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
              color={theme.color7}
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
        <XStack marginTop={12} alignItems="center">
          <XStack
            paddingVertical={2}
            paddingHorizontal={4}
            alignItems="center"
            backgroundColor={theme.chipBg}
            borderRadius={20}
            borderWidth={2}
            borderColor="transparent"
            gap={4}
            minHeight={44}
            maxWidth={140}
            width={140}
            overflow="hidden"
            hoverStyle={{
              backgroundColor: theme.chipBgHover,
              borderColor: theme.accent,
              shadowColor: theme.accent,
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Image
              source={{ uri: selectedSet.logoUrl }}
              style={{
                flex: 1,
                height: 38,
                aspectRatio: 2.4,
                borderRadius: 10,
                alignSelf: "center",
                marginLeft: 6,
                marginRight: 6,
              }}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={{
                marginLeft: 0,
                padding: 0,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                height: 28,
                width: 28,
                minWidth: 24,
                minHeight: 24,
              }}
              onPress={onClearFilter}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                color={theme.color}
                fontSize={18}
                fontWeight="500"
                style={{ lineHeight: 20 }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </XStack>
        </XStack>
      )}
    </YStack>
  );
};
