import { Stack } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

function useProtectedRoute(user: any, isAuthLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isIndexPage = segments[0] === 'index';

    if (!user && !inAuthGroup) {
      // Reindirizza alla pagina di login se l'utente non è autenticato
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Reindirizza alla home se l'utente è già autenticato
      router.replace('/home');
    } else if (user && isIndexPage) {
      // Reindirizza alla home se l'utente è sulla pagina index
      router.replace('/home');
    }
  }, [user, isAuthLoading, segments, router]);
}

function RootLayoutNav() {
  const { user, isAuthLoading } = useAuth();
  useProtectedRoute(user ?? null, isAuthLoading);
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#333',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}


export default function RootLayout() {
  return <RootLayoutNav />;
}