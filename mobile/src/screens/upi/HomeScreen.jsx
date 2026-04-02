import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import ScreenContainer from "../../components/ScreenContainer";
import AssistantSheet from "../../components/AssistantSheet";
import { appColors } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionsContext";
import { useAuth } from "../../context/AuthContext";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString();
}

function getLinkedBank(user) {
  const username = String(user?.username || "UPI User").trim();
  const firstName = username.split(" ")[0] || "UPI";
  return {
    name: `${firstName} Bank`,
    accountMask: "XXXX 4821",
  };
}

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { walletSummary, transactions, addTransaction } = useTransactions();
  const { user } = useAuth();
  const [addAmount, setAddAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const linkedBank = useMemo(() => getLinkedBank(user), [user]);

  const recent = transactions.slice(0, 6);
  const recentReceivers = useMemo(() => {
    const unique = [];
    const seen = new Set();

    for (const txn of transactions) {
      const key = `${txn.receiverName}-${txn.upiId}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push({ name: txn.receiverName, vpa: txn.upiId });
      }

      if (unique.length >= 6) {
        break;
      }
    }

    return unique;
  }, [transactions]);

  async function handleAddMoney() {
    const amount = Number(addAmount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert("Enter valid amount", "Please enter amount to add in wallet.");
      return;
    }

    if (adding) {
      return;
    }

    setAdding(true);
    await addTransaction({
      _id: `topup-${Date.now()}`,
      receiverName: linkedBank.name,
      upiId: "wallet@upi",
      amount,
      transactionType: "income",
      status: "success",
      timestamp: new Date().toISOString(),
      location: "Linked Bank",
      reason: "Wallet top up from linked bank",
      merchantTrustScore: 100,
      isFraudulent: false,
    });

    setAddAmount("");
    setAdding(false);
    Alert.alert("Money Added", `Rs ${amount.toLocaleString("en-IN")} added from linked bank.`);
  }

  return (
    <ScreenContainer>
      <LinearGradient colors={["#12a64f", "#0b7c39"]} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>{t("home.totalBalance")}</Text>
        <Text style={styles.balanceValue}>{formatCurrency(walletSummary.totalBalance)}</Text>
        <View style={styles.balanceStats}>
          <View>
            <Text style={styles.balanceSub}>{t("home.income")}</Text>
            <Text style={styles.balanceSubValue}>{formatCurrency(walletSummary.income)}</Text>
          </View>
          <View>
            <Text style={styles.balanceSub}>{t("home.expense")}</Text>
            <Text style={styles.balanceSubValue}>{formatCurrency(walletSummary.expense)}</Text>
          </View>
        </View>
        <Text style={styles.openingText}>
          {t("home.openingBalance", { value: formatCurrency(walletSummary.openingBalance) })}
        </Text>
      </LinearGradient>

      <View style={styles.topupCard}>
        <Text style={styles.topupTitle}>Add Money to Wallet</Text>
        <Text style={styles.topupMeta}>{linkedBank.name} ({linkedBank.accountMask})</Text>
        <View style={styles.topupRow}>
          <TextInput
            value={addAmount}
            onChangeText={setAddAmount}
            placeholder="Enter amount"
            placeholderTextColor="rgba(231,255,233,0.45)"
            keyboardType="decimal-pad"
            style={styles.topupInput}
          />
          <Pressable style={styles.topupBtn} onPress={handleAddMoney} disabled={adding}>
            <Text style={styles.topupBtnText}>{adding ? "Adding..." : "Add"}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("home.sendMoney")}</Text>
      </View>

      <Pressable style={styles.newTransferBtn} onPress={() => navigation.navigate("Payment", { actionType: "Transfer" })}>
        <Text style={styles.newTransferText}>{t("home.newTransfer")}</Text>
      </Pressable>

      {recentReceivers.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipientsRow}>
          {recentReceivers.map((receiver) => (
            <Pressable
              key={`${receiver.name}-${receiver.vpa}`}
              style={styles.receiverChip}
              onPress={() =>
                navigation.navigate("Payment", {
                  actionType: "Transfer",
                  recipient: { name: receiver.name, vpa: receiver.vpa, bank: "UPI", trustScore: 70 },
                })
              }
            >
              <Text style={styles.receiverName}>{receiver.name}</Text>
              <Text style={styles.receiverMeta}>{receiver.vpa}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}

      <AssistantSheet />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    borderRadius: 20,
    padding: 16,
    gap: 8,
    marginTop: 8,
  },
  balanceLabel: {
    color: "rgba(229,255,236,0.92)",
    fontSize: 13,
    fontWeight: "600",
  },
  balanceValue: {
    color: "#f6fff8",
    fontSize: 30,
    fontWeight: "800",
  },
  balanceStats: {
    flexDirection: "row",
    gap: 24,
    marginTop: 4,
  },
  balanceSub: {
    color: "rgba(229,255,236,0.85)",
    fontSize: 12,
  },
  balanceSubValue: {
    color: "#fff",
    fontWeight: "700",
    marginTop: 2,
    fontSize: 13,
  },
  openingText: {
    marginTop: 6,
    color: "rgba(229,255,236,0.82)",
    fontSize: 11,
  },
  topupCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 12,
    gap: 8,
  },
  topupTitle: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 15,
  },
  topupMeta: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  topupRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  topupInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0d1f17",
    color: appColors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "700",
  },
  topupBtn: {
    borderRadius: 12,
    backgroundColor: appColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#03280f",
    fontWeight: "800",
    fontSize: 13,
  },
  sectionTitle: {
    color: appColors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  recipientsRow: {
    gap: 12,
    paddingBottom: 4,
  },
  newTransferBtn: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.primary,
    alignItems: "center",
    paddingVertical: 12,
  },
  newTransferText: {
    color: "#03280f",
    fontWeight: "800",
    fontSize: 14,
  },
  sectionHeader: {
    marginTop: 8,
  },
  recipientsRow: {
    gap: 12,
    paddingBottom: 4,
  },
  receiverChip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0d1f17",
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 140,
  },
  receiverName: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 12,
  },
  receiverMeta: {
    color: appColors.textMuted,
    marginTop: 2,
    fontSize: 10,
  },
});
