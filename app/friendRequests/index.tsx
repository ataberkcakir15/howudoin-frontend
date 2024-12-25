import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import {
  getPendingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/services/api";
import { useRouter } from "expo-router";

export default function FriendRequestsScreen() {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  const [requests, setRequests] = useState<any[]>([]);
  const [toEmail, setToEmail] = useState("");
  const [feedBackMsg, setFeedBackMsg] = useState("");

  useEffect(() => {
    if (token) {
      fetchPendingRequests();
    }
  }, [token]);

  const fetchPendingRequests = async () => {
    try {
      setFeedBackMsg("");
      const data = await getPendingRequests(token!);
      setRequests(data);
    } catch (error: any) {
      console.log("Error fetching pending requests", error.message);
      setFeedBackMsg("Error fetching pending requests");
    }
  };

  const handleSendRequest = async () => {
    if (!toEmail.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }
    try {
      setFeedBackMsg("");
      const message = await sendFriendRequest(toEmail.trim(), token!);
      setFeedBackMsg(message);
      setToEmail("");
    } catch (error: any) {
      console.log("Send friend request error:", error.message);
      setFeedBackMsg(error.response?.data || "Error sending friend request");
    }
  };

  const handleAcceptRequest = async (fromEmail: string) => {
    try {
      setFeedBackMsg("");
      const message = await acceptFriendRequest(fromEmail, token!);
      setFeedBackMsg(message);
      fetchPendingRequests();
    } catch (error: any) {
      console.log("Accept friend request error:", error.message);
      setFeedBackMsg(error.response?.data || "Error accepting friend request");
    }
  };

  const handleRejectRequest = async (fromEmail: string) => {
    try {
      setFeedBackMsg("");
      const message = await rejectFriendRequest(fromEmail, token!);
      setFeedBackMsg(message);
      fetchPendingRequests();
    } catch (error: any) {
      console.log("Reject friend request error:", error.message);
      setFeedBackMsg(error.response?.data || "Error rejecting request");
    }
  };

  const renderRequestItem = ({ item }: { item: any }) => {
    const senderEmail = item.sender?.email;
    const senderName =
      `${item.sender?.firstName} ${item.sender?.lastName}`.trim();

    return (
      <View style={styles.requestCard}>
        <Text style={styles.requestSender}>{senderName || senderEmail}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => handleAcceptRequest(senderEmail)}
          >
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#E53935" }]}
            onPress={() => handleRejectRequest(senderEmail)}
          >
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>&larr; Back</Text>
        </TouchableOpacity>
        <Text style={styles.description}>
          Send and manage your friend requests
        </Text>
      </View>

      {feedBackMsg ? <Text style={styles.feedback}>{feedBackMsg}</Text> : null}

      <View style={styles.sendCard}>
        <Text style={styles.cardTitle}>Send a Friend Request</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#ccc"
          value={toEmail}
          onChangeText={setToEmail}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
          <Text style={styles.sendButtonText}>Send Request</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Incoming Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No pending requests at the moment.
          </Text>
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191929",
    paddingHorizontal: 16,
    paddingTop: 73,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#fff",
    flex: 1,
  },
  feedback: {
    color: "#00E676",
    textAlign: "center",
    marginVertical: 8,
  },
  sendCard: {
    backgroundColor: "#1F2233",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1C1E2B",
    borderRadius: 5,
    padding: 10,
    color: "#fff",
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 8,
    color: "#fff",
  },
  requestCard: {
    backgroundColor: "#1F2233",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  requestSender: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
