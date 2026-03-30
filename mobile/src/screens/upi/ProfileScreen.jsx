import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

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

export default function ProfileScreen() {
  const { user } = useAuth();

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
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.text}>Your account details linked to authenticated user.</Text>
      </View>

      <View style={styles.infoCard}>
        <Row label="Name" value={account.name} />
        <Row label="Email" value={account.email} />
        <Row label="Account Number" value={account.accountNumber} />
        <Row label="IFSC" value={account.ifsc} />
      </View>
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
