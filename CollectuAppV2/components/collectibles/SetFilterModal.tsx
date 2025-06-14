import React from "react";
import { Modal, ScrollView } from "react-native";
import { YStack, XStack, Text, Card, Image, Spinner, Button } from "tamagui";
import { PokemonSet } from "../../types/pokemon"; // Adjust path if necessary

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
      <YStack flex={1} >
        <YStack flex={1} onPress={onClose} />
        <Card
          padding={24}
          height="75%"
          margin={0}
          borderTopLeftRadius={24}
          borderTopRightRadius={24}
          backgroundColor="$backgroundStrong"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <XStack justifyContent="space-between" alignItems="center" marginBottom={24}>
            <Text fontSize={22} fontWeight="bold" color="$color">
              Select a Set
            </Text>
            <Button
              onPress={onClose}
              backgroundColor="$backgroundTransparent"
              borderRadius={20}
              width={40}
              height={40}
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="$borderColorLight"
              padding={0}
              minWidth={0}
            >
              <Text fontSize={18} color="$color" fontWeight="300">✕</Text>
            </Button>
          </XStack>

          {isLoading ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <YStack padding={24} alignItems="center" backgroundColor="$backgroundFocus" borderRadius={16}>
                <Spinner size="large" color="$accentColor10" />
                <Text color="$color" fontSize={16} marginTop={16}>
                  Loading sets...
                </Text>
              </YStack>
            </YStack>
          ) : sets.length === 0 ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <YStack padding={24} alignItems="center" backgroundColor="$backgroundFocus" borderRadius={16}>
                <Text fontSize={20} fontWeight="bold" color="$color" textAlign="center" marginBottom={12}>
                  No sets available
                </Text>
                <Text fontSize={14} color="$colorFocus" textAlign="center">
                  Please try again later
                </Text>
              </YStack>
            </YStack>
          ) : (
            <ScrollView
              style={{ flex: 1, marginHorizontal: -8 }}
              showsVerticalScrollIndicator={false}
            >
              <YStack gap={12} paddingHorizontal={8}>
                {sets.map((set) => (
                  <Button
                    key={set.setId}
                    onPress={() => onSelectSet(set)}
                    backgroundColor="$backgroundFocus"
                    borderRadius={16}
                    borderWidth={1}
                    borderColor="$borderColorFocus"
                    padding={0} 
                    minWidth={0}
                    flexDirection="row"
                    alignItems="center"
                  >
                    <YStack
                      backgroundColor="$backgroundTransparent"
                      borderRadius={12}
                      padding={8}
                      marginRight={16}
                      borderWidth={1}
                      borderColor="$borderColorLight"
                    >
                      <Image
                        source={{ uri: set.logoUrl }}
                        style={{ width: 52, height: 52 }}
                        resizeMode="contain"
                      />
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize={16} fontWeight="bold" color="$color" marginBottom={4}>
                        {set.setName}
                      </Text>
                      <Text fontSize={12} color="$colorFocus">
                        {set.releaseDate}
                      </Text>
                    </YStack>
                  </Button>
                ))}
              </YStack>
            </ScrollView>
          )}
        </Card>
      </YStack>
    </Modal>
  );
};