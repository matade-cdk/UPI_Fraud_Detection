import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import SectionCard from "../../components/SectionCard";
import { modelMetrics } from "../../constants/mockData";
import { appColors } from "../../constants/theme";

export default function MLModelScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>ML Model</Text>
      <Text style={styles.pageSub}>Model health and performance</Text>

      <SectionCard title="Model Diagnostics">
        <View style={styles.grid}>
          {modelMetrics.map((m) => (
            <View key={m.label} style={styles.cell}>
              <Text style={styles.label}>{m.label}</Text>
              <Text style={styles.value}>{m.value}</Text>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  cell: {
    width: "48.5%",
    backgroundColor: appColors.panelAlt,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  label: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  value: {
    color: appColors.primary,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
});
