import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import SectionCard from "../../components/SectionCard";
import { appColors } from "../../constants/theme";

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Settings</Text>
      <Text style={styles.pageSub}>Configuration and alert controls</Text>

      <SectionCard title="Fraud Threshold">
        <Text style={styles.bigValue}>65 / 100</Text>
        <Text style={styles.helper}>Recommended production range: 60-70</Text>
      </SectionCard>

      <SectionCard title="System Controls">
        <View style={styles.controlRow}>
          <View>
            <Text style={styles.rowTitle}>Webhook notifications</Text>
            <Text style={styles.rowSub}>Send alert events to external systems</Text>
          </View>
          <Switch value />
        </View>

        <View style={styles.controlRow}>
          <View>
            <Text style={styles.rowTitle}>Auto block high-risk</Text>
            <Text style={styles.rowSub}>Instantly block transactions above threshold</Text>
          </View>
          <Switch value={false} />
        </View>
      </SectionCard>

      <Pressable style={styles.cta}>
        <Text style={styles.ctaTxt}>Save Settings</Text>
      </Pressable>
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
  bigValue: {
    color: appColors.primary,
    fontSize: 34,
    fontWeight: "800",
  },
  helper: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  rowTitle: {
    color: appColors.text,
    fontWeight: "700",
  },
  rowSub: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  cta: {
    marginTop: 2,
    backgroundColor: appColors.primary,
    borderRadius: 999,
    alignItems: "center",
    paddingVertical: 12,
  },
  ctaTxt: {
    color: "#03280f",
    fontWeight: "800",
  },
});
