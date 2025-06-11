import { Stack } from "expo-router";
import { AuthProvider } from "../hooks/useAuth";
import { TamaguiProvider } from 'tamagui';
import { config } from '../tamagui.config';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <TamaguiProvider config={config} defaultTheme="dark">
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#333",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TamaguiProvider>
    </AuthProvider>
  );
} 