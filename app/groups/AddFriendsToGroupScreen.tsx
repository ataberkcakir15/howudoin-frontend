import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { getFriends, addMemberToGroup } from "@/services/api";
import { StatusBar } from "expo-status-bar";

type FriendDTO = {
  email: string;
  firstName?: string;
  lastName?: string;
};

export default function AddFriendsToGroupScreen() {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const [friends, setFriends] = useState<FriendDTO[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && groupId) {
      loadFriends();
    }
  }, [token, groupId]);

  const loadFriends = async () => {
    try {
      setError("");
      const data = await getFriends(token!);
      setFriends(data);
    } catch (err: any) {
      setError(err.message || "Failed to load friends");
    }
  };

  const toggleFriend = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails((prev) => prev.filter((e) => e !== email));
    } else {
      setSelectedEmails((prev) => [...prev, email]);
    }
  };

  const handleAddFriends = async () => {
    if (selectedEmails.length === 0) {
      setError("Please select at least one friend to add.");
      return;
    }
    setLoading(true);
    try {
      setError("");
      for (const email of selectedEmails) {
        await addMemberToGroup(token!, groupId!, email);
      }
      router.back();
    } catch (err: any) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes("already in the group")
      ) {
        setError("User is already in the group");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("User is already in the group");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFriendItem = ({ item }: { item: FriendDTO }) => {
    const isSelected = selectedEmails.includes(item.email);

    return (
      <TouchableOpacity
        style={[styles.friendItem, isSelected && styles.friendItemSelected]}
        onPress={() => toggleFriend(item.email)}
      >
        <Text style={{ color: isSelected ? "#fff" : "#000" }}>
          {item.firstName
            ? `${item.firstName} ${item.lastName || ""}`
            : item.email}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#151929" />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Friends to Group</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={friends}
        keyExtractor={(item) => item.email}
        renderItem={renderFriendItem}
        style={{ marginBottom: 16 }}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddFriends}
        disabled={loading}
      >
        <Text style={styles.addButtonText}>
          {loading ? "Adding..." : "Add Friends"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#151929" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 50,
  },
  backButton: {
    marginRight: 10,
    marginLeft: -50,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
  friendItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  friendItemSelected: { backgroundColor: "#4C566A" },
  addButton: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: { color: "#151929", fontWeight: "bold" },
});
