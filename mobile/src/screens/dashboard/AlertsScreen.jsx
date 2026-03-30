import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import SectionCard from "../../components/SectionCard";
import RiskBadge from "../../components/RiskBadge";
import { alerts } from "../../constants/mockData";
import { appColors } from "../../constants/theme";

export default function AlertsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Fraud Alerts</Text>
      <Text style={styles.pageSub}>Active flags and incidents</Text>

      <SectionCard title="Alerts Feed" subtitle="open and acknowledged">
        {alerts.map((a) => (
          <View key={`${a.text}-${a.time}`} style={styles.row}>
            <RiskBadge level={a.tier} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertText}>{a.text}</Text>
              <Text style={styles.time}>{a.time}</Text>
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
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 7,
  },
  alertText: {
    color: appColors.text,
    lineHeight: 18,
  },
  time: {
    color: appColors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
