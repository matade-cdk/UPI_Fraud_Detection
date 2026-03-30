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
      isFraudulent: Boolean(incoming.isFraudulent),
      fraudReason: incoming.fraudReason || "",
      txnId: incoming.txnId || `TXN-${Date.now()}`,
      timestamp: incoming.timestamp ? new Date(incoming.timestamp) : new Date(),
      location: incoming.location || "Unknown",
      reason: incoming.reason || "",
    };
  }, [route?.params?.transaction]);

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
      merchantTrustScore: transaction.trustScore,
      timestamp: transaction.timestamp.toISOString(),
      transactionType: "expense",
      location: transaction.location,
      reason: transaction.reason,
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

      <View style={[styles.card, transaction.isFraudulent ? styles.riskCard : styles.safeCard]}>
        <Text style={styles.title}>{transaction.isFraudulent ? "High Risk Transfer" : "Ready to Transfer"}</Text>
        <Text style={styles.subtitle}>
          {transaction.isFraudulent
            ? transaction.fraudReason || "This payment looks suspicious."
            : "Fraud check passed. Continue to transfer."}
        </Text>

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
          <Text style={styles.label}>Balance After</Text>
          <Text style={styles.value}>{formatCurrency(balanceAfter)}</Text>
        </View>

        <Pressable style={styles.confirmBtn} onPress={handleConfirm} disabled={saving || saved}>
          <Text style={styles.confirmBtnText}>{saving ? "Saving..." : "Confirm Transfer"}</Text>
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
