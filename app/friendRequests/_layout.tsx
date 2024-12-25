import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function FriendRequestsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Friend Requests",
          headerShown: false,
          headerRight: () => (
            <Pressable
              onPress={() => {
                // Örnek: başka bir sayfaya gitmek
                // router.push("/someOtherScreen");
              }}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="help-circle-outline" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
