import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionsContext";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function CardsScreen() {
  const { t } = useTranslation();
  const { transactions } = useTransactions();

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>{t("cards.title")}</Text>
        <Text style={styles.text}>{t("cards.subtitle")}</Text>
      </View>

      <View style={styles.feedWrap}>
        {transactions.length ? (
          transactions.map((txn) => (
            <View key={txn._id} style={styles.txnRow}>
              <View style={styles.txnLeft}>
                <Text style={styles.txnReceiver}>{txn.receiverName}</Text>
                <Text style={styles.txnTime}>{new Date(txn.timestamp).toLocaleString()}</Text>
                <Text style={styles.txnTime}>{txn.location || t("cards.unknown")}</Text>
              </View>
              <View style={styles.txnRight}>
                <Text style={styles.txnAmount}>{formatCurrency(txn.amount)}</Text>
                <Text style={styles.txnStatus}>{txn.status.toUpperCase()}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{t("cards.empty")}</Text>
        )}
      </View>
    </ScreenContainer>
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
  feedWrap: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 10,
    gap: 8,
  },
  txnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0d1f17",
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  txnLeft: {
    flex: 1,
  },
  txnReceiver: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 13,
  },
  txnTime: {
    color: appColors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  txnRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  txnAmount: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 13,
  },
  txnStatus: {
    color: appColors.primary,
    fontWeight: "700",
    fontSize: 10,
  },
  emptyText: {
    color: appColors.textMuted,
    fontSize: 13,
  },
});
