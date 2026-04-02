import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionsContext";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function PaymentDecisionScreen({ navigation, route }) {
  const { addTransaction, walletSummary } = useTransactions();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const transaction = useMemo(() => {
    const incoming = route?.params?.transaction || {};
    return {
      amount: Number(incoming.amount || 0),
      receiverName: incoming.receiverName || "Unknown",
      upiId: incoming.upiId || "unknown@upi",
      trustScore: Number(incoming.trustScore || 0),
      riskScore: Number(incoming.riskScore || 0),
      riskLevel: incoming.riskLevel || "LOW",
      isFraudulent: Boolean(incoming.isFraudulent),
      fraudReason: incoming.fraudReason || "",
      txnId: incoming.txnId || `TXN-${Date.now()}`,
      timestamp: incoming.timestamp ? new Date(incoming.timestamp) : new Date(),
      location: incoming.location || "Unknown",
      reason: incoming.reason || "",
      merchantCategory: incoming.merchantCategory || "",
      deviceId: incoming.deviceId || "",
      fraudLabel: incoming.fraudLabel || "",
      step: Number(incoming.step || 0),
      oldbalanceOrg: Number(incoming.oldbalanceOrg || 0),
      newbalanceOrig: Number(incoming.newbalanceOrig || 0),
      oldbalanceDest: Number(incoming.oldbalanceDest || 0),
      newbalanceDest: Number(incoming.newbalanceDest || 0),
    };
  }, [route?.params?.transaction]);

  const advisory = useMemo(() => {
    const riskScorePct = Math.round(transaction.riskScore * 100);
    const level = String(transaction.riskLevel || "LOW").toUpperCase();

    if (level === "HIGH" || riskScorePct >= 80) {
      return {
        title: "High Risk Transfer",
        subtitle:
          transaction.fraudReason ||
          "High alert: fraud chance is high. You can continue, but verify the recipient before payment.",
        tone: "high",
      };
    }

    if (level === "MEDIUM" || riskScorePct >= 50) {
      return {
        title: "Risk Involved",
        subtitle:
          transaction.fraudReason ||
          "Warning: fraud chance is 50% or more. Payment can be done carefully.",
        tone: "medium",
      };
    }

    return {
      title: "Ready to Transfer",
      subtitle: "Fraud check passed. Continue to transfer.",
      tone: "low",
    };
  }, [transaction.fraudReason, transaction.riskLevel, transaction.riskScore]);

  const balanceAfter = walletSummary.totalBalance - transaction.amount;

  async function handleConfirm() {
    if (saving || saved) {
      return;
    }

    setSaving(true);
    await addTransaction({
      _id: transaction.txnId,
      receiverName: transaction.receiverName,
      upiId: transaction.upiId,
      amount: transaction.amount,
      status: transaction.isFraudulent ? "flagged" : "success",
      merchantTrustScore: Math.round(transaction.riskScore * 100),
      timestamp: transaction.timestamp.toISOString(),
      transactionType: "expense",
      location: transaction.location,
      reason: transaction.reason,
      isFraudulent: transaction.isFraudulent,
      merchantCategory: transaction.merchantCategory,
      deviceId: transaction.deviceId,
      fraudLabel: transaction.fraudLabel,
      step: transaction.step,
      oldbalanceOrg: transaction.oldbalanceOrg,
      newbalanceOrig: transaction.newbalanceOrig,
      oldbalanceDest: transaction.oldbalanceDest,
      newbalanceDest: transaction.newbalanceDest,
    });
    setSaving(false);
    setSaved(true);
    navigation.navigate("Dashboard");
  }

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={appColors.text} />
        </Pressable>
        <Text style={styles.header}>Transfer Review</Text>
        <View style={styles.backBtn} />
      </View>

      <View
        style={[
          styles.card,
          advisory.tone === "high"
            ? styles.riskCard
            : advisory.tone === "medium"
              ? styles.warnCard
              : styles.safeCard,
        ]}
      >
        <Text style={styles.title}>{advisory.title}</Text>
        <Text style={styles.subtitle}>{advisory.subtitle}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Amount</Text>
          <Text style={styles.value}>{formatCurrency(transaction.amount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Receiver</Text>
          <Text style={styles.value}>{transaction.receiverName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>UPI</Text>
          <Text style={styles.value}>{transaction.upiId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{transaction.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Risk Level</Text>
          <Text style={styles.value}>{transaction.riskLevel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Risk Score</Text>
          <Text style={styles.value}>{Math.round(transaction.riskScore * 100)}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Balance After</Text>
          <Text style={styles.value}>{formatCurrency(balanceAfter)}</Text>
        </View>

        <Pressable style={styles.confirmBtn} onPress={handleConfirm} disabled={saving || saved}>
          <Text style={styles.confirmBtnText}>{saving ? "Saving..." : advisory.tone === "high" ? "Proceed With Warning" : "Confirm Transfer"}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  backBtn: {
    height: 34,
    width: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  safeCard: {
    borderColor: appColors.low,
    backgroundColor: "rgba(54, 209, 111, 0.09)",
  },
  riskCard: {
    borderColor: appColors.danger,
    backgroundColor: "rgba(255, 79, 95, 0.08)",
  },
  warnCard: {
    borderColor: appColors.warning,
    backgroundColor: "rgba(251, 191, 36, 0.10)",
  },
  title: {
    color: appColors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: appColors.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  value: {
    color: appColors.text,
    fontWeight: "700",
    maxWidth: "65%",
    textAlign: "right",
  },
  confirmBtn: {
    marginTop: 8,
    backgroundColor: appColors.primary,
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#03280f",
    fontWeight: "800",
    fontSize: 15,
  },
});
