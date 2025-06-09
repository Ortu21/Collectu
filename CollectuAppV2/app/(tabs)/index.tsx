import { YStack, Text } from 'tamagui';

export default function HomeScreen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Text fontSize={24} fontWeight="bold">Benvenuto nella Home!</Text>
    </YStack>
  );
}
