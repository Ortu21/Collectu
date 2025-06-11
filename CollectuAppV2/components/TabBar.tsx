import { TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { YStack, Text, XStack } from "tamagui";
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs' with { "resolution-mode": "import" };

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const router = useRouter();
  const currentRoute = state.routes[state.index].name;

  const tabs = [
    { name: "home", label: "Collection", icon: "cube-outline" },
    {
      name: "collectibles",
      label: "Search",
      icon: "search-outline",
    },
    {
      name: "listings",
      label: "Listings",
      icon: "list-outline",
    },
    {
      name: "profile",
      label: "Settings",
      icon: "settings-outline",
    },
  ];

  return (
    <XStack
      backgroundColor="#ffffff"
      borderTopWidth={1}
      borderColor="#e0e0e0"
      paddingBottom={Platform.OS === 'ios' ? 20 : 12}
      paddingTop={12}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      zIndex={100}
    >
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.name;
        const activeColor = isActive ? '#000000' : '#666666';

        return (
          <TouchableOpacity
            key={tab.name}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 4,
            }}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: tab.name,
                canPreventDefault: true,
              });

              if (!event.defaultPrevented) {
                navigation.navigate(tab.name);
              }
            }}
          >
            <YStack alignItems="center">
              <Ionicons
                name={
                  isActive
                    ? (tab.icon.replace("-outline", "") as any)
                    : (tab.icon as any)
                }
                size={28}
                color={activeColor}
              />
              <Text
                fontSize={12}
                marginTop={4}
                fontWeight="600"
                color={activeColor}
              >
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