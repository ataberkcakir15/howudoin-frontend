import { Tabs } from "expo-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MainLayout() {
  const { token, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/auth/LoginScreen");
    }
  }, [token, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarStyle: {
            backgroundColor: "#161622",
          },
        }}
      />
      <Tabs.Screen
        name="friendsList"
        options={{
          title: "My Friends",
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          //headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          tabBarStyle: {
            backgroundColor: "#161622",
          },
          headerRight: () => (
            <Ionicons
              name="add"
              size={24}
              color="black"
              style={{ marginRight: 16 }}
              onPress={() => router.push("/friendRequests")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Groups"
        options={{
          title: "Groups",
          headerShown: false,
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          tabBarStyle: {
            backgroundColor: "#161622",
          },
        }}
      />
    </Tabs>
  );
}
