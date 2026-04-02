import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { useTranslation } from "react-i18next";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { useTransactions } from "../../context/TransactionsContext";

function formatCurrency(value) {
  return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

function RiskDonut({ lowRate, mediumRate, highRate }) {
  const size = 170;
  const center = size / 2;
  const radius = 62;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  const low = Math.max(0, lowRate);
  const medium = Math.max(0, mediumRate);
  const high = Math.max(0, highRate);
  const totalRate = Math.max(low + medium + high, 1);

  const lowLen = (low / totalRate) * circumference;
  const mediumLen = (medium / totalRate) * circumference;
  const highLen = circumference - lowLen - mediumLen;

  return (
    <View style={styles.pieWrap}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(231,255,233,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#00ff66"
          strokeWidth={strokeWidth}
          strokeDasharray={`${lowLen} ${circumference - lowLen}`}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#ffd400"
          strokeWidth={strokeWidth}
          strokeDasharray={`${mediumLen} ${circumference - mediumLen}`}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${(-90 + (lowLen / circumference) * 360)} ${center} ${center})`}
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#ff3b3b"
          strokeWidth={strokeWidth}
          strokeDasharray={`${highLen} ${circumference - highLen}`}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(${(-90 + ((lowLen + mediumLen) / circumference) * 360)} ${center} ${center})`}
        />
        <Circle cx={center} cy={center} r={36} fill="#07120d" />
        <SvgText x={center} y={center - 6} fill={appColors.text} fontSize="16" fontWeight="700" textAnchor="middle">
          {lowRate}%
        </SvgText>
        <SvgText x={center} y={center + 14} fill={appColors.textMuted} fontSize="10" fontWeight="700" textAnchor="middle">
          SAFE
        </SvgText>
      </Svg>
    </View>
  );
}

function BarChart({ values, labels }) {
  const maxValue = Math.max(...values, 1);

  return (
    <View style={styles.barChartWrap}>
      {values.map((value, index) => {
        const heightPct = Math.max(8, Math.round((value / maxValue) * 100));
        return (
          <View key={`${labels[index]}-${index}`} style={styles.barCol}>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { height: `${heightPct}%` }]} />
            </View>
            <Text style={styles.barLabel}>{labels[index]}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function InsightsScreen() {
  const { t } = useTranslation();
  const { transactions, walletSummary } = useTransactions();

  const analytics = useMemo(() => {
    const dailySpend = new Array(7).fill(0);
    let totalSpend = 0;
    let safeCount = 0;
    let flaggedCount = 0;
    let fraudCount = 0;
    let txnCount = 0;

    transactions.forEach((txn) => {
      const amount = Number(txn.amount || 0);
      const date = new Date(txn.timestamp);
      const isIncome = txn.transactionType === "income";
      const status = String(txn.status || "").toLowerCase();
      const isFraud = Boolean(txn.isFraudulent || status === "blocked");
      const isFlagged = Boolean(txn.isFlaggedFraud || status === "flagged" || status === "blocked");

      if (!isIncome) {
        totalSpend += amount;
        dailySpend[date.getDay()] += amount;
        txnCount += 1;
      }

      if (isFraud) {
        fraudCount += 1;
      } else if (isFlagged) {
        flaggedCount += 1;
      } else if (!isIncome) {
        safeCount += 1;
      }
    });

    const totalMonitored = safeCount + flaggedCount + fraudCount || 1;
    const safeRate = Math.round((safeCount / totalMonitored) * 100);
    const mediumRate = Math.round((flaggedCount / totalMonitored) * 100);
    const highRate = Math.max(0, 100 - safeRate - mediumRate);

    return {
      totalSpend,
      txnCount,
      safeRate,
      mediumRate,
      highRate,
      dailySpend,
    };
  }, [transactions]);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <ScreenContainer>
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
          <Text style={styles.kpiValue}>{analytics.txnCount}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Fraud / Flagged</Text>
          <Text style={styles.kpiValue}>{analytics.highRate + analytics.mediumRate}%</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Risk Distribution</Text>
        <View style={styles.riskDistWrap}>
          <RiskDonut
            lowRate={analytics.safeRate}
            mediumRate={analytics.mediumRate}
            highRate={analytics.highRate}
          />
          <View style={styles.riskLegend}>
            <View style={styles.riskLegendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#00ff66" }]} />
              <Text style={styles.legendText}>Low Risk</Text>
              <Text style={[styles.legendPct, { color: "#00ff66" }]}>{analytics.safeRate}%</Text>
            </View>
            <View style={styles.riskLegendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#ffd400" }]} />
              <Text style={styles.legendText}>Medium Risk</Text>
              <Text style={[styles.legendPct, { color: "#ffd400" }]}>{analytics.mediumRate}%</Text>
            </View>
            <View style={styles.riskLegendRow}>
              <View style={[styles.legendDot, { backgroundColor: "#ff3b3b" }]} />
              <Text style={styles.legendText}>High Risk</Text>
              <Text style={[styles.legendPct, { color: "#ff3b3b" }]}>{analytics.highRate}%</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Analytics Bar Graph</Text>
        <BarChart values={analytics.dailySpend} labels={dayLabels} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  riskDistWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  pieWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  riskLegend: {
    flex: 1,
    gap: 12,
  },
  riskLegendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: appColors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    flex: 1,
  },
  legendPct: {
    fontSize: 22,
    fontWeight: "800",
  },
  barChartWrap: {
    minHeight: 170,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  barTrack: {
    height: 130,
    width: 20,
    borderRadius: 8,
    backgroundColor: "rgba(231,255,233,0.10)",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: appColors.primary,
  },
  barLabel: {
    color: appColors.textMuted,
    fontSize: 11,
  },
});