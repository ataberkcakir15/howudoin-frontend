import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="LoginScreen"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="RegistrationScreen"
        options={{ title: "Register", headerShown: false }}
      />
    </Stack>
  );
}
