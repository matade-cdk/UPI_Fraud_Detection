import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionsContext";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function InsightsScreen() {
  const { t } = useTranslation();
  const { transactions, walletSummary } = useTransactions();

  const analytics = useMemo(() => {
    const buckets = new Array(7).fill(0);

    transactions.forEach((txn) => {
      const day = new Date(txn.timestamp).getDay();
      if (txn.transactionType !== "income") {
        buckets[day] += Number(txn.amount || 0);
      }
    });

    const maxBucket = Math.max(...buckets, 1);
    const totalTxns = transactions.length;
    const fraud = transactions.filter((txn) => txn.isFraudulent || txn.status === "blocked").length;
    const flagged = transactions.filter(
      (txn) => txn.isFlaggedFraud || txn.status === "flagged" || txn.status === "blocked"
    ).length;
    const safeRate = totalTxns ? Math.round(((totalTxns - flagged) / totalTxns) * 100) : 100;

    return { buckets, maxBucket, totalTxns, fraud, flagged, safeRate };
  }, [transactions]);

  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>{t("insights.title")}</Text>
        <Text style={styles.text}>{t("insights.subtitle")}</Text>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>{t("insights.totalExpense")}</Text>
          <Text style={styles.kpiValue}>{formatCurrency(walletSummary.expense)}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>{t("insights.safetyScore")}</Text>
          <Text style={styles.kpiValue}>{analytics.safeRate}%</Text>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>{t("insights.transactions")}</Text>
          <Text style={styles.kpiValue}>{analytics.totalTxns}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Fraud</Text>
          <Text style={styles.kpiValue}>{analytics.fraud}</Text>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>{t("insights.flagged")}</Text>
          <Text style={styles.kpiValue}>{analytics.flagged}</Text>
        </View>
        <View style={styles.kpiCard} />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{t("insights.sevenDayGraph")}</Text>
        <View style={styles.chartWrap}>
          {analytics.buckets.map((value, idx) => {
            const height = Math.max(10, Math.round((value / analytics.maxBucket) * 120));
            return (
              <View key={labels[idx] + idx} style={styles.barCol}>
                <View style={[styles.bar, { height }]} />
                <Text style={styles.barLabel}>{labels[idx]}</Text>
              </View>
            );
          })}
        </View>
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
  kpiRow: {
    flexDirection: "row",
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0d1f17",
    padding: 12,
    gap: 5,
  },
  kpiLabel: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  kpiValue: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 18,
  },
  chartCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 14,
    gap: 12,
  },
  chartTitle: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 15,
  },
  chartWrap: {
    minHeight: 150,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  bar: {
    width: 20,
    borderRadius: 8,
    backgroundColor: appColors.primary,
  },
  barLabel: {
    color: appColors.textMuted,
    fontSize: 11,
  },
});
