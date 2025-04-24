import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation }: { state: any; descriptors: any; navigation: any }) => {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[0] || 'home'; // Default to home if no segment

  const tabs = [
    { name: 'home', label: 'Collection', icon: 'cube-outline', route: '/home' },
    { name: 'collectibles', label: 'Search', icon: 'search-outline', route: '/collectibles' },
    { name: 'listings', label: 'Listings', icon: 'list-outline', route: '/listings' }, // Assuming a listings route exists or will be created
    { name: 'profile', label: 'Settings', icon: 'settings-outline', route: '/profile' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => router.push(tab.route)}
          >
            <Ionicons
              name={isActive ? tab.icon.replace('-outline', '') as any : tab.icon as any}
              size={24}
              color={isActive ? '#4CAF50' : '#666'}
            />
            <Text style={[styles.tabText, { color: isActive ? '#4CAF50' : '#666' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    paddingBottom: 20, // Adjust as needed for safe area
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabBar;