import { Stack } from 'expo-router';
export default function RootLayout() {
  return (
      <Stack screenOptions={{
        headerShown: false, 
        headerStyle: {
          backgroundColor: '#333', 
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        {/* Nasconde l'header per le schermate principali come login, register, index */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />

        <Stack.Screen name="home" options={{ title: 'Home', headerShown: true }} /> 
        <Stack.Screen name="collectibles" options={{ title: 'Ricerca Carte', headerShown: true }} /> /
        <Stack.Screen name="card/[id]" options={{ title: 'Dettaglio Carta', headerShown: true }} /> 

        <Stack.Screen name="profile" options={{ title: 'Profilo Utente', headerShown: true }} />
      </Stack>
  );
}