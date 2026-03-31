import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { languageOptions } from "../../i18n";

function maskEmail(email = "") {
  const [left, domain] = email.split("@");
  if (!left || !domain) {
    return "-";
  }

  if (left.length <= 2) {
    return `${left[0] || "*"}*@${domain}`;
  }

  return `${left.slice(0, 2)}***@${domain}`;
}

function getAccountNumber(user) {
  const source = String(user?.userId || user?.id || "000000000000").replace(/\D/g, "");
  const padded = (source + "000000000000").slice(0, 12);
  return `${padded.slice(0, 4)} ${padded.slice(4, 8)} ${padded.slice(8, 12)}`;
}

export default function ProfileScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Landing" }],
    });
  }

  const account = useMemo(() => {
    return {
      name: user?.username || "UPI User",
      email: maskEmail(user?.email || ""),
      accountNumber: getAccountNumber(user),
      ifsc: "UPIG0001234",
    };
  }, [user]);

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>{t("profile.title")}</Text>
        <Text style={styles.text}>{t("profile.subtitle")}</Text>
      </View>

      <View style={styles.infoCard}>
        <Row label={t("profile.name")} value={account.name} />
        <Row label={t("profile.email")} value={account.email} />
        <Row label={t("profile.accountNumber")} value={account.accountNumber} />
        <Row label={t("profile.ifsc")} value={account.ifsc} />
      </View>

      <View style={styles.languageCard}>
        <Text style={styles.languageTitle}>{t("profile.language")}</Text>
        <Text style={styles.languageHint}>{t("profile.languageHint")}</Text>
        <View style={styles.languageGrid}>
          {languageOptions.map((lang) => {
            const active = i18n.language === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={[styles.languageChip, active && styles.languageChipActive]}
                onPress={() => i18n.changeLanguage(lang.code)}
              >
                <Text style={[styles.languageChipText, active && styles.languageChipTextActive]}>{t(lang.key)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </Pressable>
    </ScreenContainer>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 16,
    gap: 8,
  },
  title: {
    color: appColors.text,
    fontSize: 21,
    fontWeight: "800",
  },
  text: {
    color: appColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0d1f17",
    padding: 14,
    gap: 12,
  },
  languageCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 14,
    gap: 8,
  },
  languageTitle: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 15,
  },
  languageHint: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: appColors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#0d1f17",
  },
  languageChipActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  languageChipText: {
    color: appColors.text,
    fontSize: 12,
    fontWeight: "700",
  logoutBtn: {
    marginTop: 12,
    backgroundColor: "#c62828",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  },
  languageChipTextActive: {
    color: "#03280f",
  },
  row: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  label: {
    color: appColors.textMuted,
    fontSize: 11,
  },
  value: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 14,
  },
});
