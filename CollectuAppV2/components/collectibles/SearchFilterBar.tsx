import React from "react";
import { TouchableOpacity } from "react-native"; // Removed Platform as it wasn't used
import { YStack, XStack, Text, Image, Input } from "tamagui";
import { PokemonSet } from "../../types/pokemon"; // Adjust path if necessary

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
  return (
    <YStack backgroundColor="$background" padding={16} borderRadius={12}>
      <XStack alignItems="center" marginBottom={10}>
        <Input
          style={{
            flex: 1,
            padding: 12,
          }}
          placeholder="Search cards..."
          placeholderTextColor="$color6" // Tamagui color token
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </XStack>

      <XStack alignItems="center" justifyContent="space-between" gap={10}>
        <TouchableOpacity onPress={onFilterPress}>
          <Text
            color="$color1" // Tamagui color token
            fontSize={16}
            fontWeight="bold"
          >
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
              color="$color7" // Tamagui color token
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
          backgroundColor="$backgroundStrong" // Tamagui color token
          borderRadius={12}
          borderWidth={1}
          borderColor="$borderColor" // Tamagui color token
        >
          <XStack alignItems="center" flex={1}>
            <Image
              source={{ uri: selectedSet.logoUrl }}
              style={{
                width: 40,
                height: 40,
                marginRight: 12,
                borderRadius: 8,
                backgroundColor: "$background", // Tamagui color token
                borderWidth: 1,
                borderColor: "$borderColor", // Tamagui color token
              }}
              resizeMode="contain"
            />
            <Text
              color="$color1" // Tamagui color token
              fontSize={14}
              fontWeight="bold"
            >
              {selectedSet.setName}
            </Text>
          </XStack>

          <TouchableOpacity
            style={{
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "$background", // Tamagui color token
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "$borderColor", // Tamagui color token
            }}
            onPress={onClearFilter}
          >
            <Text
              color="$color7" // Tamagui color token
              fontSize={12}
              fontWeight="500"
            >
              Clear
            </Text>
          </TouchableOpacity>
        </XStack>
      )}
    </YStack>
  );
};
