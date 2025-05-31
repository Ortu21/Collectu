import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="[id]" 
        options={{
          headerShown: false,
          title: "",
          presentation: "card"
        }}
      />
    </Stack>
  );
}
