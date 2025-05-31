import React from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  XStack, // Importa XStack per il contenitore orizzontale
  YStack, // Potrebbe servire YStack per allineare icona e testo verticalmente
  Text, // Importa Text da Tamagui
} from "tamagui";
// Importa gli stili glassmorphic centralizzati
import {
  getPlatformGlassmorphicStyle,
  glassmorphicBarStyles,
} from "../styles/glassmorphicStyles";

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
  const currentRoute = segments[0] || "home"; // Default to home if no segment

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
    }, // Assuming a listings route exists or will be created
    {
      name: "profile",
      label: "Settings",
      icon: "settings-outline",
      route: "/profile",
    },
  ];

  // Ottieni gli stili glassmorphic per la TabBar dal file centralizzato
  const tabBarGlassStyles = getPlatformGlassmorphicStyle(glassmorphicBarStyles);

  // Stile per i singoli item della TabBar
  const tabItemStyle = {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const, // Centra icona e testo verticalmente
    paddingVertical: 4, // Aggiungi un po' di padding verticale all'item
  };

  const tabTextStyle = {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600" as const, // Rendi il testo un po' più spesso
  };

  return (
    // Usa XStack per il contenitore principale e applica gli stili glassmorphic centralizzati
    <XStack
      style={{
        ...tabBarGlassStyles, // Applica gli stili glassmorphic di base
        paddingBottom: 20, // Mantieni padding specifici del layout
        paddingTop: 12, // Mantieni padding specifici del layout
        position: "absolute" as const, // Mantieni posizionamento fisso
        bottom: 0,
        left: 0,
        right: 0,
        // borderTopWidth e borderTopColor sono già inclusi in glassmorphicBarStyles
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.name;
        const iconColor = isActive ? "#4CAF50" : "#aaa"; // Colore icona
        const textColor = isActive ? "#4CAF50" : "#ccc"; // Colore testo

        return (
          <TouchableOpacity
            key={tab.name}
            style={tabItemStyle} // Applica lo stile dell'item
            onPress={() => router.push(tab.route)}
          >
            {/* Usa YStack per allineare icona e testo verticalmente all'interno dell'item */}
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
              {/* Usa il componente Text di Tamagui con lo stile del testo */}
              <Text style={[tabTextStyle, { color: textColor }]}>
                {tab.label}
              </Text>
            </YStack>
          </TouchableOpacity>
        );
      })}
    </XStack>
  );
};

export default TabBar;
