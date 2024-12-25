import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "@/services/api";

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);

  const handleRegister = async () => {
    setEmailError(false);
    setPasswordError(false);
    setFirstNameError(false);
    setLastNameError(false);

    let hasError = false;

    if (!email) {
      setEmailError(true);
      hasError = true;
    }
    if (!password) {
      setPasswordError(true);
      hasError = true;
    }
    if (!firstName) {
      setFirstNameError(true);
      hasError = true;
    }
    if (!lastName) {
      setLastNameError(true);
      hasError = true;
    }

    if (hasError) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError("");
      const data = await registerUser(firstName, lastName, email, password);
      Alert.alert("Registration successful", "You can now log in.");
      router.push("/auth/LoginScreen");
    } catch (err: any) {
      console.log("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="blue" />
      <Text style={styles.header}>HOWUDOIN</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={[styles.input, firstNameError && styles.inputError]}
        placeholder="First Name"
        placeholderTextColor="#333"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={[styles.input, lastNameError && styles.inputError]}
        placeholder="Last Name"
        placeholderTextColor="#333"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#333"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        placeholder="Password"
        placeholderTextColor="#333"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ marginVertical: 10 }}>
        <Button title="Register" onPress={handleRegister} color="#fff" />
      </View>

      <View style={{ marginVertical: 5 }}>
        <Button
          title="Already have an account? Log in"
          onPress={() => router.push("/auth/LoginScreen")}
          color="#87CEFA"
        />
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
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});
