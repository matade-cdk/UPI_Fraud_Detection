import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { appColors } from "../constants/theme";

const tones = {
  HIGH: { bg: "rgba(255, 79, 95, 0.2)", fg: appColors.danger },
  MEDIUM: { bg: "rgba(251, 191, 36, 0.2)", fg: appColors.warning },
  LOW: { bg: "rgba(54, 209, 111, 0.2)", fg: appColors.low },
};

export default function RiskBadge({ level }) {
  const tone = tones[level] || tones.LOW;
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}> 
      <Text style={[styles.text, { color: tone.fg }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
