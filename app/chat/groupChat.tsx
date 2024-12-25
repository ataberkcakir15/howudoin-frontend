import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { getGroupMessages, sendGroupMessage } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";

type GroupMessageDTO = {
  id: string;
  groupId: string;
  senderEmail: string;
  senderFirstName?: string;
  senderLastName?: string;
  content: string;
  timestamp: string;
};

export default function GroupChatScreen() {
  const { token, userEmail } = useContext(AuthContext);
  const router = useRouter();

  const { groupId, groupName } = useLocalSearchParams<{
    groupId?: string;
    groupName?: string;
  }>();

  const [messages, setMessages] = useState<GroupMessageDTO[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !groupId) return;
    fetchGroupMessages(groupId);
  }, [token, groupId]);

  const fetchGroupMessages = async (grpId: string) => {
    try {
      setError("");
      const data = await getGroupMessages(token!, grpId);
      setMessages(data);
    } catch (err: any) {
      setError(err.message || "Error fetching group messages");
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    if (!token || !groupId) return;

    try {
      setError("");
      await sendGroupMessage(token!, groupId, newMessage);
      await fetchGroupMessages(groupId);
      setNewMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send group message");
    }
  };

  const handleAddUser = () => {
    router.push({
      pathname: "/groups/AddFriendsToGroupScreen",
      params: { groupId },
    });
  };

  const renderMessageItem = ({ item }: { item: GroupMessageDTO }) => {
    const isMyMessage = item.senderEmail === userEmail;

    let senderDisplayName = item.senderEmail;
    if (item.senderFirstName && item.senderLastName) {
      senderDisplayName = `${item.senderFirstName} ${item.senderLastName}`;
    }

    return (
      <View style={styles.messageContainer}>
        {!isMyMessage && (
          <Text style={styles.senderLabel}>{senderDisplayName}</Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessage : styles.theirMessage,
          ]}
        >
          <Text style={[styles.messageText, isMyMessage && { color: "#fff" }]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, isMyMessage && { color: "#fff" }]}>
            {new Date(item.timestamp).toLocaleString("tr-TR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#151929" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{groupName ?? "Group Chat"}</Text>
          <TouchableOpacity onPress={handleAddUser} style={styles.addButton}>
            <Ionicons name="person-add" size={24} color="#151929" />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          style={styles.messageList}
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>Henüz grup mesajı yok.</Text>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  backButton: { padding: 4, marginRight: 8 },
  screenTitle: { fontSize: 20, fontWeight: "bold" },
  addButton: { marginLeft: "auto", padding: 4 },
  error: { color: "red", textAlign: "center", marginVertical: 4 },
  messageList: { flex: 1, paddingHorizontal: 12 },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  sendButton: {
    backgroundColor: "#151929",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: { color: "#fff", fontWeight: "600" },
  messageContainer: { marginBottom: 8 },
  senderLabel: {
    marginLeft: 4,
    marginBottom: 2,
    fontSize: 12,
    color: "#999",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 16,
    maxWidth: "75%",
  },
  myMessage: { backgroundColor: "#151929", alignSelf: "flex-end" },
  theirMessage: { backgroundColor: "#E5E5EA", alignSelf: "flex-start" },
  messageText: { fontSize: 16, color: "#000" },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
    color: "#666",
  },
});
