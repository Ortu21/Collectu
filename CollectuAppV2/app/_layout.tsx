import { Stack } from "expo-router";
import { AuthProvider } from "../hooks/useAuth";
import { TamaguiProvider } from 'tamagui';
import { config } from '../tamagui.config';
import { useFonts } from 'expo-font';
import { useState, useCallback } from 'react';
import { ThemeContext, ThemeType } from '../theme/ThemeContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  const [theme, setTheme] = useState<ThemeType>('dark');
  const toggleTheme = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), []);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <TamaguiProvider config={config} defaultTheme={theme}>
          <Stack
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </TamaguiProvider>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}