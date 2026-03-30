import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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

  const topAnim = useRef(new Animated.Value(0)).current;
  const heroAnim = useRef(new Animated.Value(0)).current;
  const bottomAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const glowFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(130, [
      Animated.timing(topAnim, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnim, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowFloatAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowFloatAnim, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bottomAnim, glowFloatAnim, heroAnim, pulseAnim, topAnim]);

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
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glowOrbA,
            {
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] }),
              transform: [
                {
                  translateY: glowFloatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glowOrbB,
            {
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.16, 0.34] }),
              transform: [
                {
                  translateY: glowFloatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.topBar,
            {
              opacity: topAnim,
              transform: [
                {
                  translateY: topAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }),
                },
              ],
            },
          ]}
        >
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
            <Animated.View
              style={[
                styles.liveDot,
                {
                  transform: [
                    {
                      scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.24] }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.liveTxt}>Model Live</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: heroAnim,
            transform: [
              {
                translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }),
              },
            ],
          }}
        >
        <LinearGradient colors={["rgba(0,255,65,0.23)", "rgba(0,255,65,0.05)"]} style={styles.heroCard}>
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
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomArea,
            {
              opacity: bottomAnim,
              transform: [
                {
                  translateY: bottomAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
                },
              ],
            },
          ]}
        >
          <Pressable onPress={() => navigation.navigate("Auth")} style={({ pressed }) => [styles.primaryBtnWrap, pressed && { opacity: 0.92 }]}> 
            <LinearGradient colors={["#32ff83", "#00ff41"]} style={styles.primaryBtn}>
              <Text style={styles.primaryBtnTxt}>Get Started</Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.footerCopy}>Trusted by fintech teams across India</Text>
        </Animated.View>
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
    position: "relative",
    overflow: "hidden",
  },
  glowOrbA: {
    position: "absolute",
    top: -80,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: "rgba(0,255,65,0.15)",
  },
  glowOrbB: {
    position: "absolute",
    bottom: 20,
    left: -70,
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "rgba(0,200,90,0.12)",
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
    shadowColor: "#00ff41",
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
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
  primaryBtnWrap: {
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,255,65,0.4)",
    shadowColor: "#00ff41",
    shadowOpacity: 0.34,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  primaryBtn: {
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
