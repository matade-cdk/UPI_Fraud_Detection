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
import { useTranslation } from "react-i18next";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthScreen({ navigation }) {
  const { t } = useTranslation();
  const { login, signUp, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const title = useMemo(() => {
    return mode === "signup" ? t("auth.createAccount") : t("auth.welcomeBack");
  }, [mode, t]);

  const subtitle = useMemo(() => {
    return mode === "signup"
      ? t("auth.signupSubtitle")
      : t("auth.loginSubtitle");
  }, [mode, t]);

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();
  const usernameValid = mode !== "signup" || cleanUsername.length >= 2;
  const emailValid = EMAIL_REGEX.test(cleanEmail);
  const passwordValid = password.length >= 6;
  const canSubmit = usernameValid && emailValid && passwordValid && !loading;

  async function handleSubmit() {
    if (mode === "signup" && cleanUsername.length < 2) {
      setError(t("auth.usernameError"));
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError(t("auth.emailError"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.passwordError"));
      return;
    }

    setError("");
    const payload =
      mode === "signup"
        ? { username: cleanUsername, email: cleanEmail, password }
        : { email: cleanEmail, password };

    const result = mode === "signup" ? await signUp(payload) : await login(payload);

    if (!result.ok) {
      setError(result.error || t("auth.failed"));
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
          <Text style={styles.brandSub}>{t("auth.brandSub")}</Text>
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
                setShowPassword(false);
              }}
            >
              <Text style={[styles.toggleTxt, mode === "login" && styles.toggleTxtActive]}>{t("auth.login")}</Text>
            </Pressable>
            <Pressable
              style={[styles.toggleBtn, mode === "signup" && styles.toggleBtnActive]}
              onPress={() => {
                setMode("signup");
                setError("");
                setShowPassword(false);
              }}
            >
              <Text style={[styles.toggleTxt, mode === "signup" && styles.toggleTxtActive]}>{t("auth.signUp")}</Text>
            </Pressable>
          </View>

          <Text style={styles.heading}>{title}</Text>
          <Text style={styles.sub}>{subtitle}</Text>

          {mode === "signup" ? (
            <View style={styles.inputWrap}>
              <Text style={styles.label}>{t("auth.username")}</Text>
              <TextInput
                value={username}
                onChangeText={(value) => {
                  setUsername(value);
                  if (error) {
                    setError("");
                  }
                }}
                placeholder={t("auth.enterUsername")}
                placeholderTextColor={appColors.textMuted}
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          ) : null}

          <View style={styles.inputWrap}>
            <Text style={styles.label}>{t("auth.email")}</Text>
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
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>{t("auth.password")}</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (error) {
                    setError("");
                  }
                }}
                placeholder={t("auth.enterPassword")}
                placeholderTextColor={appColors.textMuted}
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.passwordToggle}
              >
                <Text style={styles.passwordToggleText}>{showPassword ? "Hide" : "Show"}</Text>
              </Pressable>
            </View>
            <Text style={styles.hintText}>Password must be at least 6 characters.</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {!error && !canSubmit ? (
            <Text style={styles.helperText}>Fill all required fields to continue.</Text>
          ) : null}

          <Pressable style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={!canSubmit}>
            {loading ? (
              <ActivityIndicator size="small" color="#03280f" />
            ) : (
              <Text style={styles.submitTxt}>
                {mode === "signup" ? t("auth.createAccountCta") : t("auth.login")}
              </Text>
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
  passwordRow: {
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "rgba(0,0,0,0.22)",
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    color: appColors.text,
    paddingVertical: 11,
  },
  passwordToggle: {
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,255,65,0.12)",
  },
  passwordToggleText: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 12,
  },
  hintText: {
    color: appColors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  helperText: {
    color: appColors.textMuted,
    fontSize: 12,
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
  submitBtnDisabled: {
    opacity: 0.45,
  },
  submitTxt: {
    color: "#03280f",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
