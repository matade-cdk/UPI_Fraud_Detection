import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import SectionCard from "../../components/SectionCard";
import { fraudTrend, riskDistribution, weeklyBars } from "../../constants/mockData";
import { appColors } from "../../constants/theme";

export default function AnalyticsScreen() {
  const maxFraud = Math.max(...fraudTrend);
  const maxTotal = Math.max(...weeklyBars.map((d) => d.total));

  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Analytics</Text>
      <Text style={styles.pageSub}>Trends, patterns and charts</Text>

      <SectionCard title="Fraud incidents - Last 14 days" subtitle="Rolling daily fraud count">
        <View style={styles.sparkWrap}>
          {fraudTrend.map((point, index) => (
            <View
              key={`spark-${index}`}
              style={[
                styles.sparkBar,
                { height: 14 + (point / maxFraud) * 76 },
              ]}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Risk Distribution">
        <View style={styles.distributionRow}>
          {riskDistribution.map((r) => (
            <View key={r.label} style={styles.distributionCol}>
              <Text style={styles.distributionPct}>{r.pct}%</Text>
              <Text style={styles.distributionLabel}>{r.label}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Weekly Volume vs Fraud">
        <View style={styles.barChartWrap}>
          {weeklyBars.map((item) => (
            <View key={item.day} style={styles.barCol}>
              <View style={styles.track}>
                <View style={[styles.totalBar, { height: `${(item.total / maxTotal) * 100}%` }]} />
                <View style={[styles.fraudBar, { height: `${(item.fraud / maxTotal) * 600}%` }]} />
              </View>
              <Text style={styles.day}>{item.day}</Text>
            </View>
          ))}
        </View>
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: appColors.text,
    marginTop: 8,
    fontSize: 26,
    fontWeight: "800",
  },
  pageSub: {
    color: appColors.textMuted,
    marginTop: -4,
    marginBottom: 8,
  },
  sparkWrap: {
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 5,
  },
  sparkBar: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: "rgba(0,255,65,0.65)",
  },
  distributionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  distributionCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 2,
  },
  distributionPct: {
    color: appColors.primary,
    fontSize: 26,
    fontWeight: "800",
  },
  distributionLabel: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  barChartWrap: {
    height: 170,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  track: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  totalBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,255,65,0.25)",
  },
  fraudBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255,79,95,0.8)",
  },
  day: {
    color: appColors.textMuted,
    fontSize: 11,
  },
});
