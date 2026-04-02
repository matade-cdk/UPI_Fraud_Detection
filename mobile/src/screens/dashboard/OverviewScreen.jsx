import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import SectionCard from "../../components/SectionCard";
import RiskBadge from "../../components/RiskBadge";
import { alerts, overviewCards, transactions } from "../../constants/mockData";
import { appColors } from "../../constants/theme";

export default function OverviewScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Overview</Text>
      <Text style={styles.pageSub}>System health at a glance</Text>

      <View style={styles.cardsGrid}>
        {overviewCards.map((card) => (
          <View key={card.label} style={styles.metricCard}>
            <Text style={styles.metricLabel}>{card.label}</Text>
            <Text
              style={[
                styles.metricValue,
                card.color === "danger" && { color: appColors.danger },
                card.color === "warning" && { color: appColors.warning },
              ]}
            >
              {card.value}
            </Text>
            <Text style={styles.metricTrend}>{card.trend}</Text>
          </View>
        ))}
      </View>

      <SectionCard title="Recent Transactions" subtitle="Live feed">
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.txnId}>{item.id}</Text>
                <Text style={styles.secondary}>{item.upi}</Text>
              </View>
              <View style={styles.rightRow}>
                <Text style={styles.amount}>{item.amount}</Text>
                <RiskBadge level={item.risk} />
              </View>
            </View>
          )}
        />
      </SectionCard>

      <SectionCard title="Real-Time Alerts">
        {alerts.map((alert) => (
          <View key={`${alert.text}-${alert.time}`} style={styles.alertRow}>
            <RiskBadge level={alert.tier} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.alertTxt}>{alert.text}</Text>
              <Text style={styles.secondary}>{alert.time}</Text>
            </View>
          </View>
        ))}
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
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    width: "48.5%",
    backgroundColor: appColors.panel,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 16,
    padding: 12,
    gap: 5,
  },
  metricLabel: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  metricValue: {
    color: appColors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  metricTrend: {
    color: appColors.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rightRow: {
    alignItems: "flex-end",
    gap: 6,
  },
  txnId: {
    color: appColors.text,
    fontWeight: "700",
  },
  amount: {
    color: appColors.text,
    fontWeight: "700",
  },
  secondary: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  separator: {
    height: 10,
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 6,
  },
  alertTxt: {
    color: appColors.text,
    lineHeight: 17,
  },
});
