import React, { useEffect } from "react";
import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs' with { "resolution-mode": "import" };
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { Spinner, YStack } from "tamagui";

export default function TabsLayout() {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (!user) {
    // Optionally render nothing while redirecting
    return null;
  }

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
