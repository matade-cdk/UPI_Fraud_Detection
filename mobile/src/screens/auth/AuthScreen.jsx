import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthScreen({ navigation }) {
  const { login, signUp, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const title = useMemo(() => {
    return mode === "signup" ? "Create account" : "Welcome back";
  }, [mode]);

  const subtitle = useMemo(() => {
    return mode === "signup"
      ? "Sign up with username, email and password"
      : "Log in with email and password";
  }, [mode]);

  async function handleSubmit() {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (mode === "signup" && cleanUsername.length < 2) {
      setError("Username should be at least 2 characters.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setError("");
    const payload =
      mode === "signup"
        ? { username: cleanUsername, email: cleanEmail, password }
        : { email: cleanEmail, password };

    const result = mode === "signup" ? await signUp(payload) : await login(payload);

    if (!result.ok) {
      setError(result.error || "Authentication failed");
      return;
    }

    navigation.replace("Dashboard");
  }

  return (
    <ScreenContainer scroll={false}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topRow}>
          <Text style={styles.brand}>UPI Guard</Text>
          <Text style={styles.brandSub}>Secure access</Text>
        </View>

        <LinearGradient
          colors={["rgba(0,255,65,0.2)", "rgba(0,255,65,0.05)"]}
          style={styles.card}
        >
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggleBtn, mode === "login" && styles.toggleBtnActive]}
              onPress={() => {
                setMode("login");
                setError("");
              }}
            >
              <Text style={[styles.toggleTxt, mode === "login" && styles.toggleTxtActive]}>Login</Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, mode === "signup" && styles.toggleBtnActive]}
              onPress={() => {
                setMode("signup");
                setError("");
              }}
            >
              <Text style={[styles.toggleTxt, mode === "signup" && styles.toggleTxtActive]}>Sign Up</Text>
            </Pressable>
          </View>

          <Text style={styles.heading}>{title}</Text>
          <Text style={styles.sub}>{subtitle}</Text>

          {mode === "signup" ? (
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Enter username"
                placeholderTextColor={appColors.textMuted}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          ) : null}

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (error) {
                  setError("");
                }
              }}
              placeholder="name@example.com"
              placeholderTextColor={appColors.textMuted}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (error) {
                  setError("");
                }
              }}
              placeholder="Enter password"
              placeholderTextColor={appColors.textMuted}
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#03280f" />
            ) : (
              <Text style={styles.submitTxt}>{mode === "signup" ? "Create Account" : "Login"}</Text>
            )}
          </Pressable>
        </LinearGradient>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },
  topRow: {
    alignItems: "center",
    gap: 6,
  },
  brand: {
    color: appColors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  brandSub: {
    color: appColors.textMuted,
    fontSize: 13,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 16,
    gap: 12,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 4,
    gap: 6,
  },
  toggleBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
  },
  toggleBtnActive: {
    backgroundColor: appColors.primary,
  },
  toggleTxt: {
    color: appColors.text,
    fontWeight: "700",
  },
  toggleTxtActive: {
    color: "#042a11",
  },
  heading: {
    color: appColors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  sub: {
    color: appColors.textMuted,
    fontSize: 13,
    marginBottom: 2,
  },
  inputWrap: {
    gap: 6,
  },
  label: {
    color: appColors.text,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "rgba(0,0,0,0.22)",
    borderRadius: 12,
    color: appColors.text,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  error: {
    color: appColors.danger,
    fontWeight: "600",
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 4,
    backgroundColor: appColors.primary,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  submitTxt: {
    color: "#03280f",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
