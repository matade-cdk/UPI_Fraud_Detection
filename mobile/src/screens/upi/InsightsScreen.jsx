import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionsContext";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function InsightsScreen() {
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
    const flagged = transactions.filter((txn) => txn.status === "flagged" || txn.status === "blocked").length;
    const safeRate = totalTxns ? Math.round(((totalTxns - flagged) / totalTxns) * 100) : 100;

    return { buckets, maxBucket, totalTxns, flagged, safeRate };
  }, [transactions]);

  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.title}>Insights & Analytics</Text>
        <Text style={styles.text}>Live spend trend and risk summary from your backend-linked transactions.</Text>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total Expense</Text>
          <Text style={styles.kpiValue}>{formatCurrency(walletSummary.expense)}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Safety Score</Text>
          <Text style={styles.kpiValue}>{analytics.safeRate}%</Text>
        </View>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Transactions</Text>
          <Text style={styles.kpiValue}>{analytics.totalTxns}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Flagged</Text>
          <Text style={styles.kpiValue}>{analytics.flagged}</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>7-Day Expense Graph</Text>
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
