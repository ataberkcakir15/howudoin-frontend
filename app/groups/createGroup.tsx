import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { getFriends, createGroup } from "@/services/api";

type FriendDTO = {
  email: string;
  firstName?: string;
  lastName?: string;
};

export default function CreateGroupScreen() {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState<FriendDTO[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      loadFriends();
    }
  }, [token]);

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

  const handleCreate = async () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    if (selectedEmails.length === 0) {
      setError("Please select at least one friend");
      return;
    }
    setLoading(true);
    try {
      setError("");
      await createGroup(token!, groupName, selectedEmails);
      router.back();
    } catch (err: any) {
      setError(err.message || "Error creating group");
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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerTitle}>Create a New Group</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Group Name"
        placeholderTextColor="#ccc"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Text style={styles.subHeader}>Select Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.email}
        renderItem={renderFriendItem}
        style={{ marginBottom: 16 }}
      />

      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={styles.createGroupButtonText}>
          {loading ? "Creating..." : "Create Group"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151929",
    padding: 16,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  backButton: {
    marginRight: 12,
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
    marginBottom: 20,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    color: "#000",
  },
  friendItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  friendItemSelected: {
    backgroundColor: "#4C566A",
  },
  createGroupButton: {
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createGroupButtonText: {
    color: "#151929",
    fontSize: 16,
    fontWeight: "600",
  },
});
