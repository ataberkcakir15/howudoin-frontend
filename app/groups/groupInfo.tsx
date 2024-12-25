import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { getGroupMembers } from "@/services/api";

export default function GroupInfoScreen() {
  const { token } = useContext(AuthContext);
  const router = useRouter();
  const { groupId, groupName } = useLocalSearchParams<{
    groupId?: string;
    groupName?: string;
  }>();

  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token && groupId) {
      fetchGroupMembers(groupId);
    }
  }, [token, groupId]);

  const fetchGroupMembers = async (grpId: string) => {
    try {
      setError("");
      const data = await getGroupMembers(token!, grpId); // Backend'den grup üyelerini çek
      setMembers(data);
    } catch (err: any) {
      setError(err.message || "Error fetching group members");
    }
  };

  const renderMemberItem = ({ item }: { item: string }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>&larr; Back</Text>
      </TouchableOpacity>
      <Text style={styles.groupName}>{groupName ?? "Group Info"}</Text>
      <Text style={styles.sectionTitle}>Members:</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item}
          renderItem={renderMemberItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  memberItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  memberText: {
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});
