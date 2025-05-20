import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

function useProtectedRoute(user: any, isAuthLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) {
      return; // Mostra la schermata di caricamento (es. index.tsx) mentre lo stato di autenticazione viene caricato
    }

    const numSegments: number = segments.length;

    const inAuthGroup = numSegments > 0 && segments[0] === '(auth)';
    // Per la route radice (app/index.tsx), segments è un array vuoto []
    const isRootIndexPage = numSegments === 0;

    if (!user) { // Utente non autenticato
      if (!inAuthGroup) {
        // Se non autenticato e non nel gruppo auth (es. sulla pagina index o una pagina protetta)
        router.replace('/login'); // Reindirizza a login
      }
      // Se è nel gruppo auth (es. /login, /register), non fare nulla, l'utente rimane lì
    } else { // Utente autenticato
      if (inAuthGroup) {
        // Se autenticato e nel gruppo auth (es. è finito per qualche motivo su /login)
        router.replace('/home'); // Reindirizza a home
      } else if (isRootIndexPage) {
        // Se autenticato e sulla pagina index radice
        router.replace('/home'); // Reindirizza a home
      }
      // Se autenticato e su un'altra pagina protetta (es. /home, /profilo), non fare nulla
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
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}