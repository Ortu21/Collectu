import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { sendPasswordReset } = useAuth(); 
  

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await sendPasswordReset(email);
      setMessage("Password reset email sent. Please check your inbox.");
      // Optionally navigate back or show success message
      // router.back();
    } catch (error: any) {
      setMessage(error.message || "Failed to send password reset email.");
      Alert.alert(
        "Error",
        error.message || "Failed to send password reset email."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email to receive reset instructions
          </Text>

          {message && (
            <View
              style={
                message.includes("sent")
                  ? styles.successContainer
                  : styles.errorContainer
              }
            >
              <Text
                style={
                  message.includes("sent")
                    ? styles.successText
                    : styles.errorText
                }
              >
                {message}
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <View style={styles.backContainer}>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.backLink}>Back to Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "rgba(0, 255, 0, 0.1)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  successText: {
    color: "#2ecc71",
    textAlign: "center",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  backLink: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
