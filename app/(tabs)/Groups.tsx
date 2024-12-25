import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { getGroups } from "@/services/api";

type GroupDTO = {
  id: string;
  name: string;
  creatorEmail: string;
  memberEmails: string[];
};

export default function GroupsTabScreen() {
  const { token } = useContext(AuthContext);
  const [groups, setGroups] = useState<GroupDTO[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetchUserGroups();
    }
  }, [token]);

  const fetchUserGroups = async () => {
    try {
      setError("");
      const data = await getGroups(token!);
      setGroups(data);
    } catch (err: any) {
      setError(err.message || "Error fetching groups");
    }
  };

  const handleCreateGroup = () => {
    router.push("/groups/createGroup");
  };

  const renderGroupItem = ({ item }: { item: GroupDTO }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() =>
        router.push(`/chat/groupChat?groupId=${item.id}&groupName=${item.name}`)
      }
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupMeta}>
        Creator: {item.creatorEmail} | Members: {item.memberEmails.length}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Groups</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {groups.length === 0 ? (
        <Text style={styles.noGroups}>No groups found</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
          style={{ marginTop: 16 }}
        />
      )}

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191929",
    padding: 16,
    paddingTop: 70,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 8,
  },
  noGroups: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 8,
  },
  groupItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  groupMeta: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  createButton: {
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createButtonText: {
    color: "#191529",
    fontSize: 16,
    fontWeight: "600",
  },
});
