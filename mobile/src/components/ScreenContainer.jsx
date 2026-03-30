import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View } from "react-native";

import { appColors } from "../constants/theme";

export default function ScreenContainer({ children, scroll = true }) {
  const body = scroll ? (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, styles.fixedContent]}>{children}</View>
  );

  return (
    <LinearGradient colors={["#04120d", "#040a07"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>{body}</SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 14,
    backgroundColor: "transparent",
  },
  fixedContent: {
    flex: 1,
    paddingTop: 6,
  },
});
