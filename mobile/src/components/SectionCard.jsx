import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { appColors, radius } from "../constants/theme";

export default function SectionCard({ title, subtitle, right, children }) {
  return (
    <View style={styles.card}>
      {(title || subtitle || right) && (
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.panel,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: appColors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: appColors.textMuted,
    fontSize: 12,
  },
});
