import { YStack, Text, Spinner } from 'tamagui';


export default function Index() {
  return (
    <YStack style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)', gap: 20 }}>
      <Spinner size="large" color="var(--color)" />
      <Text color="$color">Caricamento...</Text>
    </YStack>
  );
}
