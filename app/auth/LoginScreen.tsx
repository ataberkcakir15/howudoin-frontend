import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { loginUser } from "@/services/api";

export default function LoginScreen() {
  const router = useRouter();
  const { setToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError("");
      const data = await loginUser(email, password);
      console.log("Login API response:", data);
      console.log("Login successful:", data);

      const token = data.token;

      setToken(token);

      router.push("../(tabs)/home");
    } catch (err: any) {
      console.log("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignUp = () => {
    router.push("/auth/RegistrationScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>HOWUDOIN</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#333"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#333"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ marginVertical: 10 }}>
        <Button title="Login" onPress={handleLogin} color="#fff" />
      </View>

      <View style={{ marginVertical: 5 }}>
        <Button title="Sign Up" onPress={handleSignUp} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191929",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    position: "absolute",
    top: 60,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    color: "black",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});
