import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";

export default function ChatLayout() {
  const { friendName } = useLocalSearchParams<{ friendName?: string }>();

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="messaging"
        options={{
          headerShown: false,
          title: friendName || "Messages",
        }}
      />
      <Stack.Screen
        name="groupChat"
        options={{
          headerShown: false,
          title: friendName || "Group Chat",
        }}
      />
    </Stack>
  );
}
