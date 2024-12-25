import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { Platform } from "react-native";

// FF7043

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: Platform.select({
            ios: "slide_from_right",
            android: "slide_from_right",
          }),
        }}
      />
    </AuthProvider>
  );
}
