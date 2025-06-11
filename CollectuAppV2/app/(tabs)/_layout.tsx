import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs' with { "resolution-mode": "import" };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Collection',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="collectibles"
        options={{
          title: 'Search',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'Listings',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
