import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { TamaguiProvider } from 'tamagui';
import { ThemeProvider as CustomThemeProvider, useTheme } from '../hooks/useTheme';
import tamaguiConfig from "../tamagui.config";
import { useFonts } from 'expo-font'

function useProtectedRoute(user: any, isAuthLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const numSegments: number = segments.length;

    const inAuthGroup = numSegments > 0 && segments[0] === "(auth)";
    const isRootIndexPage = numSegments === 0;

    if (!user) {
      if (!inAuthGroup) {
        router.replace("/login");
      }
    } else {
      if (inAuthGroup) {
        router.replace("/home"); 
      } else if (isRootIndexPage) {
        router.replace("/home"); 
      }
    }
  }, [user, isAuthLoading, segments, router]);
}

function RootLayoutNav() {
  const { user, isAuthLoading } = useAuth();
  useProtectedRoute(user ?? null, isAuthLoading);
  return (
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
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (loaded) {
      // Puoi nascondere lo splash screen qui, se lo usi
    }
  }, [loaded])

  if (!loaded) {
    return null // oppure uno splash screen custom
  }

  return (
    <CustomThemeProvider>
      <InnerRootLayout />
    </CustomThemeProvider>
  );
}

function InnerRootLayout() {
  const { theme } = useTheme();
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </TamaguiProvider>
  );
}
