import React from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { YStack, Text } from "tamagui";

const TabBar = ({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: any;
}) => {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[0] || "home";

  const tabs = [
    { name: "home", label: "Collection", icon: "cube-outline", route: "/home" },
    {
      name: "collectibles",
      label: "Search",
      icon: "search-outline",
      route: "/collectibles",
    },
    {
      name: "listings",
      label: "Listings",
      icon: "list-outline",
      route: "/listings",
    },
    {
      name: "profile",
      label: "Settings",
      icon: "settings-outline",
      route: "/profile",
    },
  ];

  // Stile per i singoli item della TabBar
  const tabItemStyle = {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 4,
  };

  const tabTextStyle = {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600" as const,
  };

  return (
    <YStack
      style={{
        flexDirection: "row",
        backgroundColor: "var(--backgroundStrong)",
        borderTopWidth: 1,
        borderColor: "var(--borderColor)",
        paddingBottom: 20,
        paddingTop: 12,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.name;
        const iconColor = isActive ? "var(--color5)" : "var(--color7)";
        const textColor = isActive ? "var(--color5)" : "var(--color7)";

        return (
          <TouchableOpacity
            key={tab.name}
            style={tabItemStyle}
            onPress={() => router.push(tab.route)}
          >
            <YStack style={{ alignItems: "center" }}>
              <Ionicons
                name={
                  isActive
                    ? (tab.icon.replace("-outline", "") as any)
                    : (tab.icon as any)
                }
                size={28}
                color={iconColor}
              />
              <Text style={{ ...tabTextStyle, color: textColor }}>
                {tab.label}
              </Text>
            </YStack>
          </TouchableOpacity>
        );
      })}
    </YStack>
  );
};

export default TabBar;
