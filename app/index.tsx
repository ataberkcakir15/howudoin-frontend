import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#191529" />

      <Text style={styles.header}>Welcome to HOWUDOIN</Text>

      <TouchableOpacity
        style={
          Platform.OS === "android"
            ? [styles.button, styles.androidButton]
            : styles.button
        }
        onPress={() => {
          router.push("/auth/LoginScreen");
        }}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={
          Platform.OS === "android"
            ? [styles.button, styles.androidButton]
            : styles.button
        }
        onPress={() => {
          router.push("/auth/RegistrationScreen");
        }}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 15,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  androidButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#191529",
  },
});
