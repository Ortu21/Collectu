import React from "react";
import { Modal, ScrollView, Platform, useWindowDimensions, View } from "react-native";
import { YStack, XStack, Text, Card, Image, Spinner, Button, useTheme } from "tamagui";
import { PokemonSet } from "../../types/pokemon";

// Utility per estrarre sempre una stringa colore dal token Tamagui
const getColor = (token: any) =>
  typeof token === 'string' ? token : token?.val;

interface SetFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  sets: PokemonSet[];
  isLoading: boolean;
  onSelectSet: (set: PokemonSet) => void;
}

const useSetFilterTheme = (theme: any) => ({
  bg: getColor(theme.background),
  strongBg: getColor(theme.backgroundStrong),
  focusBg: getColor(theme.backgroundFocus),
  border: getColor(theme.borderColor),
  borderLight: getColor(theme.borderColorLight),
  borderFocus: getColor(theme.borderColorFocus),
  color: getColor(theme.color),
  colorFocus: getColor(theme.colorFocus),
  accent: getColor(theme.accent10),
  accentBg: getColor(theme.accent3),
  cardBg: getColor(theme.background),
  cardBorder: getColor(theme.borderColor),
  cardShadow: getColor(theme.shadow2),
  cardShadowHover: getColor(theme.shadow4),
  cardHoverBg: getColor(theme.accent2),
  cardHoverBorder: getColor(theme.accent8),
  cardText: getColor(theme.color12) ?? getColor(theme.color),
  cardTextSecondary: getColor(theme.color8) ?? getColor(theme.color6),
  modalBg: getColor(theme.backgroundStrong),
  modalShadow: getColor(theme.shadow4),
});

const SetCard = ({ set, onSelect, theme, selected }: { set: PokemonSet; onSelect: (set: PokemonSet) => void; theme: ReturnType<typeof useSetFilterTheme>; selected?: boolean }) => (
  <Card
    key={set.setId}
    backgroundColor={selected ? theme.accent : theme.cardBg}
    borderRadius={20}
    borderWidth={1}
    borderColor={selected ? theme.accent : theme.cardBorder}
    paddingHorizontal={28}
    paddingVertical={18}
    minWidth={0}
    flexDirection="row"
    alignItems="center"
    elevate
    shadowColor={selected ? theme.cardShadowHover : theme.cardShadow}
    shadowRadius={selected ? 20 : 10}
    style={{ width: '100%', minHeight: 100, marginBottom: 36, cursor: 'pointer', transition: 'box-shadow 0.18s, background 0.18s, border 0.18s', boxSizing: 'border-box', overflow: 'hidden' }}
    hoverStyle={{
      backgroundColor: selected ? theme.accent : theme.cardHoverBg,
      borderColor: selected ? theme.accent : theme.cardHoverBorder,
      shadowColor: theme.cardShadowHover,
      shadowRadius: 20,
    }}
    pressStyle={{}}
    onPress={() => onSelect(set)}
  >
    <YStack
      backgroundColor={theme.strongBg}
      borderRadius={14}
      alignItems="center"
      justifyContent="center"
      style={{ minWidth: 70, minHeight: 70, marginRight: 18 }}
    >
      <Image source={{ uri: set.logoUrl }} style={{ width: 56, height: 56 }} resizeMode="contain" />
    </YStack>
    <YStack flex={1} justifyContent="center" alignItems="flex-start" paddingVertical={4}>
      <Text fontSize={18} fontWeight="700" color={selected ? '#fff' : theme.cardText} marginBottom={4} numberOfLines={1} ellipsizeMode="tail">
        {set.setName}
      </Text>
      <Text fontSize={13} color={selected ? '#e0e0ff' : theme.cardTextSecondary} numberOfLines={1} ellipsizeMode="tail">
        {set.releaseDate}
      </Text>
    </YStack>
  </Card>
);

export const SetFilterModal = ({ isVisible, onClose, sets, isLoading, onSelectSet, selectedSetId }: SetFilterModalProps & { selectedSetId?: string }) => {
  const theme = useSetFilterTheme(useTheme());
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  // Responsive: 4 colonne su desktop, 2 su tablet, 1 su mobile
  let numColumns = 1;
  let maxModalWidth = 1000;
  if (isWeb && width >= 1200) {
    numColumns = 4;
    maxModalWidth = 1800;
  } else if (isWeb && width >= 700) {
    numColumns = 2;
    maxModalWidth = 900;
  }
  const gridPadding = isWeb ? 36 : 0;

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <YStack flex={1} justifyContent="center" alignItems="center">
        <YStack flex={1} onPress={onClose} />
        <Card
          padding={28}
          height="80%"
          borderTopLeftRadius={24}
          borderTopRightRadius={24}
          backgroundColor={theme.modalBg}
          borderWidth={0}
          elevate
          shadowColor={theme.modalShadow}
          shadowRadius={24}
          style={{ width: '100%', maxWidth: maxModalWidth, alignSelf: 'center' }}
        >
          <XStack justifyContent="space-between" alignItems="center" marginBottom={24}>
            <Text fontSize={22} fontWeight="700" color={theme.cardText}>Select a Set</Text>
            <Button
              onPress={onClose}
              backgroundColor={theme.cardBg}
              borderRadius={16}
              width={36}
              height={36}
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor={theme.cardBorder}
              padding={0}
              minWidth={0}
              elevate
              shadowColor={theme.cardShadow}
              shadowRadius={6}
            >
              <Text fontSize={18} color={theme.cardText} fontWeight="300">✕</Text>
            </Button>
          </XStack>
          {isLoading ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <YStack padding={20} alignItems="center" backgroundColor={theme.focusBg} borderRadius={14}>
                <Spinner size="large" color={theme.accent} />
                <Text color={theme.cardText} fontSize={15} marginTop={12}>Loading sets...</Text>
              </YStack>
            </YStack>
          ) : sets.length === 0 ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <YStack padding={20} alignItems="center" backgroundColor={theme.focusBg} borderRadius={14}>
                <Text fontSize={16} fontWeight="bold" color={theme.cardText} textAlign="center" marginBottom={10}>No sets available</Text>
                <Text fontSize={13} color={theme.cardTextSecondary} textAlign="center">Please try again later</Text>
              </YStack>
            </YStack>
          ) : (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingLeft: gridPadding, paddingRight: gridPadding}}>
              {isWeb && numColumns > 1 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                  {sets.map((set) => (
                    <View key={set.setId} style={{ flexBasis: `${100 / numColumns}%`, maxWidth: `${100 / numColumns}%`, display: 'flex', alignItems: 'center', padding: 8}}>
                      <SetCard set={set} onSelect={onSelectSet} theme={theme} selected={selectedSetId === set.setId} />
                    </View>
                  ))}
                </View>
              ) : (
                <YStack>
                  {sets.map((set) => (
                    <SetCard key={set.setId} set={set} onSelect={onSelectSet} theme={theme} selected={selectedSetId === set.setId} />
                  ))}
                </YStack>
              )}
            </ScrollView>
          )}
        </Card>
      </YStack>
    </Modal>
  );
};