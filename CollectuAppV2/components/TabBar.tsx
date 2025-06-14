import { TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { YStack, Text, XStack, useTheme } from "tamagui";
import { BlurView } from 'expo-blur';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs' with { "resolution-mode": "import" };

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const router = useRouter();
  const theme = useTheme();
  const currentRoute = state.routes[state.index].name;

  const isDark = theme.background?.val?.includes('1%, 1)') || theme.background?.val?.includes('0, 0, 0');
  const overlayColor = isDark ? 'rgba(20,20,30,0.7)' : 'rgba(255,255,255,0.7)';
  const iconActive = isDark ? '#fff' : '#222';
  const iconInactive = isDark ? '#bdbdbd' : '#888';

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
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      zIndex={100}
      height={Platform.OS === 'ios' ? 80 : 64}
      alignItems="flex-end"
      pointerEvents="box-none"
    >
      <BlurView
        intensity={30}
        tint={isDark ? 'dark' : 'light'}
        style={{
          ...Platform.select({
            ios: { height: 80 },
            android: { height: 64 },
            default: { height: 64 }
          }),
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          overflow: 'hidden',
        }}
      />
      {/* Overlay per migliorare leggibilità */}
      <XStack
        position="absolute"
        left={0}
        right={0}
        bottom={0}
        width="100%"
        height={Platform.OS === 'ios' ? 80 : 64}
        backgroundColor={overlayColor}
        borderTopLeftRadius={18}
        borderTopRightRadius={18}
        style={{ pointerEvents: 'none' }}
      />
      <XStack
        flex={1}
        width="100%"
        height={Platform.OS === 'ios' ? 80 : 64}
        justifyContent="space-between"
        alignItems="center"
        paddingBottom={Platform.OS === 'ios' ? 20 : 12}
        paddingTop={12}
        style={{ position: 'relative' }}
      >
        {tabs.map((tab) => {
          const isActive = currentRoute === tab.name;
          const activeColor = isActive ? iconActive : iconInactive;

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
    </XStack>
  );
};

export default TabBar;