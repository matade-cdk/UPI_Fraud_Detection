import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import ScreenContainer from "../../components/ScreenContainer";
import {
  heroTypedStrings,
} from "../../constants/mockData";
import { appColors } from "../../constants/theme";

export default function LandingScreen({ navigation }) {
  const [typed, setTyped] = useState("");
  const [strIdx, setStrIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = heroTypedStrings[strIdx];
    const speed = deleting ? 45 : 85;
    const timer = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setTyped(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), 1200);
      } else if (deleting && charIdx > 0) {
        setTyped(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      } else {
        setDeleting(false);
        setStrIdx((s) => (s + 1) % heroTypedStrings.length);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, strIdx]);

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <View style={styles.logoWrap}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner} />
            </View>
            <View>
              <Text style={styles.brand}>UPI Guard</Text>
              <Text style={styles.brandSub}>Fraud Shield</Text>
            </View>
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveTxt}>Model Live</Text>
          </View>
        </View>

        <LinearGradient colors={["rgba(0,255,65,0.17)", "rgba(0,255,65,0.03)"]} style={styles.heroCard}>
          <Text style={styles.badge}>AI-Powered Real-Time Protection</Text>
          <Text style={styles.heading}>Secure Every{"\n"}UPI Payment</Text>
          <Text style={styles.typed}>
            {typed}
            <Text style={styles.cursor}>|</Text>
          </Text>
          <Text style={styles.sub}>
            Detect and stop suspicious activity instantly with low-latency fraud scoring.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>99.3%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{"< 200ms"}</Text>
              <Text style={styles.statLabel}>Detection</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Monitoring</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.bottomArea}>
          <Pressable style={styles.primaryBtn} onPress={() => navigation.navigate("Dashboard")}>
            <Text style={styles.primaryBtnTxt}>Get Started</Text>
          </Pressable>

          <Text style={styles.footerCopy}>Trusted by fintech teams across India</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoOuter: {
    height: 42,
    width: 42,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: appColors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,255,65,0.05)",
  },
  logoInner: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: appColors.primary,
  },
  brand: {
    color: appColors.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  brandSub: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  liveDot: {
    height: 7,
    width: 7,
    borderRadius: 4,
    backgroundColor: appColors.primary,
  },
  liveTxt: {
    color: appColors.primary,
    fontWeight: "700",
    fontSize: 11,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: appColors.border,
    paddingHorizontal: 18,
    paddingVertical: 22,
    gap: 12,
    marginTop: 14,
  },
  badge: {
    color: appColors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  heading: {
    color: appColors.text,
    fontSize: 36,
    lineHeight: 38,
    fontWeight: "800",
  },
  typed: {
    color: appColors.primary,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "800",
  },
  cursor: {
    color: appColors.primary,
  },
  sub: {
    color: appColors.textMuted,
    lineHeight: 21,
    fontSize: 14,
    maxWidth: 340,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingVertical: 9,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 14,
  },
  statLabel: {
    color: appColors.textMuted,
    fontSize: 10,
    textTransform: "uppercase",
  },
  primaryBtn: {
    backgroundColor: appColors.primary,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnTxt: {
    color: "#03280f",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  bottomArea: {
    gap: 12,
    marginTop: 16,
  },
  footerCopy: {
    color: appColors.textMuted,
    textAlign: "center",
    fontSize: 11,
  },
});
