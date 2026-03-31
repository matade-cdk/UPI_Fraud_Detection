import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import ScreenContainer from "../../components/ScreenContainer";
import AssistantSheet from "../../components/AssistantSheet";
import { appColors } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionsContext";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatTime(iso) {
  const date = new Date(iso);
  return date.toLocaleString();
}

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { walletSummary, transactions } = useTransactions();

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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t("home.transactionHistory")}</Text>
      </View>

      <View style={styles.historyCard}>
        {recent.length ? (
          recent.map((txn) => (
            <View key={txn._id} style={styles.historyRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyName}>{txn.receiverName}</Text>
                <Text style={styles.historyMeta}>{txn.upiId}</Text>
                <Text style={styles.historyMeta}>{formatTime(txn.timestamp)}</Text>
              </View>
              <View style={styles.rightCol}>
                <Text style={styles.historyAmount}>- {formatCurrency(txn.amount)}</Text>
                <Text style={styles.historyMeta}>{txn.location || t("home.unknown")}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t("home.emptyHistory")}</Text>
        )}
      </View>

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
  sectionHeader: {
    marginTop: 8,
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
  historyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 12,
    gap: 10,
  },
  historyRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0d1f17",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  historyName: {
    color: appColors.text,
    fontWeight: "700",
  },
  historyMeta: {
    color: appColors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 2,
  },
  historyAmount: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 12,
  },
  emptyText: {
    color: appColors.textMuted,
    fontSize: 13,
  },
});
