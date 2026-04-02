import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";
import { assessTransactionRisk } from "../../services/fraudApi";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"];

export default function PaymentAmountScreen({ navigation, route }) {
  const draft = route?.params?.draft || {};
  const [amount, setAmount] = useState(String(route?.params?.presetAmount || ""));
  const [checking, setChecking] = useState(false);

  const parsedAmount = Number(amount || 0);
  const canProceed = useMemo(() => parsedAmount > 0, [parsedAmount]);

  function onKeyPress(key) {
    if (key === "back") {
      setAmount((prev) => prev.slice(0, -1));
      return;
    }

    if (key === ".") {
      setAmount((prev) => {
        if (prev.includes(".")) {
          return prev;
        }
        return prev.length ? `${prev}.` : "0.";
      });
      return;
    }

    setAmount((prev) => (prev === "0" ? key : `${prev}${key}`));
  }

  async function handleProceedAmount() {
    if (!canProceed || checking) {
      return;
    }

    const providedOldBalanceOrg = Number(draft.oldbalanceOrg || 0);
    const providedNewBalanceOrg = Number(draft.newbalanceOrig || 0);
    const providedOldBalanceDest = Number(draft.oldbalanceDest || 0);
    const providedNewBalanceDest = Number(draft.newbalanceDest || 0);

    const computedOldBalanceOrg = providedOldBalanceOrg > 0
      ? providedOldBalanceOrg
      : Math.max(parsedAmount + 10000, parsedAmount * 3);
    const computedNewBalanceOrg = providedNewBalanceOrg > 0
      ? providedNewBalanceOrg
      : Math.max(computedOldBalanceOrg - parsedAmount, 0);
    const computedOldBalanceDest = providedOldBalanceDest >= 0 ? providedOldBalanceDest : 0;
    const computedNewBalanceDest = providedNewBalanceDest > 0
      ? providedNewBalanceDest
      : computedOldBalanceDest + parsedAmount;

    const expectedNewOrg = computedOldBalanceOrg - parsedAmount;
    if (expectedNewOrg < 0) {
      Alert.alert("Insufficient balance", "Amount is higher than old balance for this account.");
      return;
    }

    setChecking(true);
    const payload = {
      transactionId: draft.transactionId || `TXN-${Date.now()}`,
      userId: draft.userId || "u_current",
      amount: parsedAmount,
      upiRecipient: draft.upiRecipient || "manual@upi",
      deviceFingerprint: "mobile-device-fp",
      ipAddress: "0.0.0.0",
      geo: { lat: 12.97, lng: 77.59 },
      timestamp: new Date().toISOString(),
      trustScore: Number(draft.trustScore || 70),
      reason: draft.reason || "Manual transfer",
      location: draft.location || "Unknown",
      actionType: draft.actionType || "Transfer",
      step: Number(draft.step || 0),
      transactionType: draft.transactionType || "TRANSFER",
      oldbalanceOrg: computedOldBalanceOrg,
      newbalanceOrig: computedNewBalanceOrg,
      oldbalanceDest: computedOldBalanceDest,
      newbalanceDest: computedNewBalanceDest,
      errorBalanceOrg: parsedAmount - (computedOldBalanceOrg - computedNewBalanceOrg),
      errorBalanceDest: parsedAmount - (computedNewBalanceDest - computedOldBalanceDest),
    };

    const result = await assessTransactionRisk(payload);
    setChecking(false);

    const riskScore = Number(result.riskScore || 0);
    const resolvedRiskLevel = String(result.riskLevel || "").toUpperCase();
    const isHighRisk = resolvedRiskLevel === "HIGH" || riskScore >= 0.8;
    const isMediumRisk = !isHighRisk && (resolvedRiskLevel === "MEDIUM" || riskScore >= 0.5);

    if (isHighRisk) {
      Alert.alert("High Risk Alert", "High fraud chance detected. You can still continue, but proceed carefully.");
    } else if (isMediumRisk) {
      Alert.alert("Warning", "50%+ fraud chance detected. Risk involved, but payment can be done carefully.");
    }

    navigation.navigate("PaymentDecision", {
      transaction: {
        amount: parsedAmount,
        receiverName: draft.receiverName || "Manual Transfer",
        upiId: draft.upiRecipient || "manual@upi",
        trustScore: Math.round((1 - Number(result.riskScore || 0)) * 100),
        riskScore,
        riskLevel: result.riskLevel || "LOW",
        isFraudulent: isHighRisk,
        fraudReason:
          result?.raw?.paymentAdvisory?.message ||
          result.reason ||
          "No suspicious pattern detected.",
        txnId: payload.transactionId,
        timestamp: new Date(),
        location: payload.location,
        reason: payload.reason,
        step: payload.step,
        oldbalanceOrg: payload.oldbalanceOrg,
        newbalanceOrig: payload.newbalanceOrig,
        oldbalanceDest: payload.oldbalanceDest,
        newbalanceDest: payload.newbalanceDest,
        mlSnapshot: {
          transactionId: payload.transactionId,
          step: payload.step,
          transactionType: payload.transactionType,
          oldbalanceOrg: payload.oldbalanceOrg,
          newbalanceOrig: payload.newbalanceOrig,
          oldbalanceDest: payload.oldbalanceDest,
          newbalanceDest: payload.newbalanceDest,
        },
      },
    });
  }

  return (
    <ScreenContainer>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={20} color={appColors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Enter Amount</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Receiver</Text>
            <Text style={styles.summaryValue}>{draft.receiverName || "Manual Transfer"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>UPI ID</Text>
            <Text style={styles.summaryValue}>{draft.upiRecipient || "manual@upi"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Type</Text>
            <Text style={styles.summaryValue}>{draft.transactionType || "TRANSFER"}</Text>
          </View>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.currency}>Rs</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="rgba(231,255,233,0.35)"
            style={styles.amountInput}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.sendBtn, !canProceed && styles.sendBtnDisabled]}
            onPress={handleProceedAmount}
            disabled={!canProceed || checking}
          >
            {checking ? (
              <ActivityIndicator color="#03280f" />
            ) : (
              <MaterialCommunityIcons name="arrow-right" size={24} color="#03280f" />
            )}
          </Pressable>
        </View>

        <View style={styles.keypadGrid}>
          {keypad.map((key) => (
            <Pressable key={key} onPress={() => onKeyPress(key)} style={styles.keyBtn}>
              {key === "back" ? (
                <MaterialCommunityIcons name="backspace-outline" size={22} color={appColors.text} />
              ) : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 4,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    height: 34,
    width: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  headerSpacer: {
    width: 34,
  },
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0b1813",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  summaryValue: {
    color: appColors.text,
    fontWeight: "700",
    maxWidth: "65%",
    textAlign: "right",
  },
  amountBox: {
    marginTop: 2,
    minHeight: 88,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  currency: {
    color: appColors.textMuted,
    fontSize: 28,
    fontWeight: "700",
  },
  amountInput: {
    color: appColors.text,
    fontSize: 42,
    fontWeight: "800",
    minWidth: 120,
  },
  actionsRow: {
    alignItems: "flex-end",
  },
  sendBtn: {
    height: 52,
    width: 52,
    borderRadius: 26,
    backgroundColor: appColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  keypadGrid: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  keyBtn: {
    width: "30%",
    height: 56,
    borderRadius: 14,
    backgroundColor: "#0b1813",
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  keyText: {
    color: appColors.text,
    fontSize: 24,
    fontWeight: "700",
  },
});