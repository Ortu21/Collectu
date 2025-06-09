import React from "react";
import { TextInput, TouchableOpacity, Platform } from "react-native";
import { YStack, XStack, Text, Image } from "tamagui";
import { PokemonSet } from "../../types/pokemon";


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
  // Usa solo variabili di tema Tamagui, elimina ogni glassmorphicStyles e colori custom RGBA
  return (
    <YStack
      style={{ backgroundColor: 'var(--background)', padding: 16, borderRadius: 12 }}
    >
      <XStack style={{ alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            color: 'var(--color1)',
            backgroundColor: 'var(--backgroundStrong)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'var(--borderColor)',
          }}
          placeholder="Search cards..."
          placeholderTextColor="var(--color6)"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </XStack>

      <XStack style={{ alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <TouchableOpacity
          style={{
            padding: 12,
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            backgroundColor: 'var(--backgroundStrong)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'var(--borderColor)',
          }}
          onPress={onFilterPress}
        >
          <Text
            color="var(--color1)"
            fontSize={16}
            fontWeight="bold"
            style={{
              textShadowColor: 'transparent',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            Set
          </Text>
        </TouchableOpacity>

        <YStack style={{ height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
          {totalCount > 0 && !isLoading && (
            <Text
              color="var(--color7)"
              fontSize={13}
              fontWeight="500"
              style={{
                textAlign: 'center',
                opacity: 0.9,
                textShadowColor: 'transparent',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              Found {totalCount} card{totalCount !== 1 ? 's' : ''}
            </Text>
          )}
        </YStack>
      </XStack>

      {selectedSet && (
        <XStack
          style={{
            marginTop: 12,
            padding: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--backgroundStrong)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'var(--borderColor)',
          }}
        >
          <XStack style={{ alignItems: 'center', flex: 1 }}>
            <Image
              source={{ uri: selectedSet.logoUrl }}
              style={{
                width: 40,
                height: 40,
                marginRight: 12,
                borderRadius: 8,
                backgroundColor: 'var(--background)',
                borderWidth: 1,
                borderColor: 'var(--borderColor)',
              }}
              resizeMode="contain"
            />
            <Text
              color="var(--color1)"
              fontSize={14}
              fontWeight="bold"
              style={{
                textShadowColor: 'transparent',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              {selectedSet.setName}
            </Text>
          </XStack>

          <TouchableOpacity
            style={{
              padding: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--background)',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'var(--borderColor)',
            }}
            onPress={onClearFilter}
          >
            <Text
              color="var(--color7)"
              fontSize={12}
              fontWeight="500"
              style={{
                textShadowColor: 'transparent',
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
