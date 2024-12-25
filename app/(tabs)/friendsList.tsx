import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { getFriends } from "@/services/api";
import { useRouter } from "expo-router";

type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function FriendsListScreen() {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const [friends, setFriends] = useState<UserDTO[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchFriends();
  }, [token]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFriends(token!);
      setFriends(data);
    } catch (error: any) {
      setError(error.message || "Error fetching friends List");
    } finally {
      setLoading(false);
    }
  };

  const goToMessages = (friendEmail: string, friendName: string) => {
    router.push(
      `../chat/messaging?otherUserEmail=${encodeURIComponent(
        friendEmail
      )}&friendName=${encodeURIComponent(friendName)}`
    );
  };

  const renderFriendItem = ({ item }: { item: UserDTO }) => {
    return (
      <TouchableOpacity
        style={styles.friendItem}
        onPress={() =>
          goToMessages(item.email, item.firstName + " " + item.lastName)
        }
      >
        <Text style={styles.friendName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.friendEmail}>{item.email}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !error && (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendItem}
          ListEmptyComponent={
            <Text style={styles.noFriends}>You have no friends yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  error: { color: "red", textAlign: "center", margin: 8 },
  friendItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  friendName: { fontSize: 16, fontWeight: "600" },
  friendEmail: { fontSize: 14, color: "#555" },
  noFriends: { marginTop: 16, textAlign: "center", color: "#777" },
});
