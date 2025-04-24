import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar'; // Importa la TabBar personalizzata

// Layout per le Tabs principali
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#333',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      tabBar={(props) => <TabBar {...props} />} // Usa la TabBar personalizzata
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Collezione', // Titolo per la schermata home
          headerShown: false, // Nascondi l'header specifico della tab, useremo quello dello Stack se necessario
        }}
      />
      <Tabs.Screen
        name="collectibles"
        options={{
          title: 'Ricerca Carte',
          headerShown: false, // Mostra l'header per questa tab
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'Annunci', // Titolo per la schermata listings
          headerShown: false, // Mostra l'header per questa tab
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profilo Utente',
          headerShown: false, // Mostra l'header per questa tab
        }}
      />
    </Tabs>
  );
}