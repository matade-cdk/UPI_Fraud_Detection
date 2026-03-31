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

export default function PaymentScreen({ navigation, route }) {
  const recipient = route?.params?.recipient || { trustScore: 70 };
  const [transactionType, setTransactionType] = useState("TRANSFER");

  const [transactionIdInput, setTransactionIdInput] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(String(new Date().getHours()));
  const [oldBalanceOrg, setOldBalanceOrg] = useState("");
  const [newBalanceOrg, setNewBalanceOrg] = useState("");
  const [oldBalanceDest, setOldBalanceDest] = useState("");
  const [newBalanceDest, setNewBalanceDest] = useState("");
  const [checking, setChecking] = useState(false);

  const parsedAmount = Number(amount || 0);
  const parsedOldBalanceOrg = Number(oldBalanceOrg || 0);
  const parsedNewBalanceOrg = Number(newBalanceOrg || 0);
  const parsedOldBalanceDest = Number(oldBalanceDest || 0);
  const parsedNewBalanceDest = Number(newBalanceDest || 0);
  const parsedStep = Number(step || 0);

  const hasDatasetFields =
    transactionIdInput.trim().length > 0 &&
    Number.isFinite(parsedStep) &&
    parsedStep >= 0 &&
    Number.isFinite(parsedOldBalanceOrg) &&
    parsedOldBalanceOrg >= 0 &&
    Number.isFinite(parsedNewBalanceOrg) &&
    parsedNewBalanceOrg >= 0 &&
    Number.isFinite(parsedOldBalanceDest) &&
    parsedOldBalanceDest >= 0 &&
    Number.isFinite(parsedNewBalanceDest) &&
    parsedNewBalanceDest >= 0;

  const canProceed = useMemo(
    () => parsedAmount > 0 && hasDatasetFields,
    [parsedAmount, hasDatasetFields]
  );

  const onKeyPress = (key) => {
    if (key === "back") {
      setAmount((prev) => prev.slice(0, -1));
      return;
    }

    if (key === ".") {
      if (amount.includes(".")) {
        return;
      }
      setAmount((prev) => (prev.length ? `${prev}.` : "0."));
      return;
    }

    setAmount((prev) => {
      if (prev === "0") {
        return key;
      }
      return `${prev}${key}`;
    });
  };

  const sendForFraudCheck = async () => {
    if (!canProceed || checking) {
      return;
    }

    const expectedNewOrg = parsedOldBalanceOrg - parsedAmount;

    if (expectedNewOrg < 0) {
      Alert.alert("Insufficient balance", "Amount is higher than old balance for this account.");
      return;
    }

    setChecking(true);
    const transactionId = transactionIdInput.trim() || `TXN-${Date.now()}`;
    const payload = {
      transactionId,
      userId: "u_current",
      amount: parsedAmount,
      upiRecipient: "manual@upi",
      deviceFingerprint: "mobile-device-fp",
      ipAddress: "0.0.0.0",
      geo: { lat: 12.97, lng: 77.59 },
      timestamp: new Date().toISOString(),
      trustScore: recipient.trustScore || 70,
      reason: "Manual transfer dataset entry",
      location: "Unknown",
      actionType: "Transfer",
      step: parsedStep,
      transactionType,
      oldbalanceOrg: parsedOldBalanceOrg,
      newbalanceOrig: parsedNewBalanceOrg,
      oldbalanceDest: parsedOldBalanceDest,
      newbalanceDest: parsedNewBalanceDest,
      errorBalanceOrg: parsedAmount - (parsedOldBalanceOrg - parsedNewBalanceOrg),
      errorBalanceDest: parsedAmount - (parsedNewBalanceDest - parsedOldBalanceDest),
    };

    const result = await assessTransactionRisk(payload);
    setChecking(false);

    const riskScore = Number(result.riskScore || 0);
    if (Boolean(result.risky) || riskScore > 0.5) {
      Alert.alert("Failed transfer", "Risk is above 50%. Suspicious activity detected.");
      return;
    }

    navigation.navigate("PaymentDecision", {
      transaction: {
        amount: parsedAmount,
        receiverName: "Manual Transfer",
        upiId: "manual@upi",
        trustScore: Math.round((1 - Number(result.riskScore || 0)) * 100),
        riskScore,
        riskLevel: result.riskLevel || "LOW",
        isFraudulent: false,
        fraudReason: result.reason || "No suspicious pattern detected.",
        txnId: transactionId,
        timestamp: new Date(),
        location: payload.location,
        reason: payload.reason,
        step: parsedStep,
        oldbalanceOrg: parsedOldBalanceOrg,
        newbalanceOrig: parsedNewBalanceOrg,
        oldbalanceDest: parsedOldBalanceDest,
        newbalanceDest: parsedNewBalanceDest,
        mlSnapshot: {
          transactionId,
          step: parsedStep,
          transactionType,
          oldbalanceOrg: parsedOldBalanceOrg,
          newbalanceOrig: parsedNewBalanceOrg,
          oldbalanceDest: parsedOldBalanceDest,
          newbalanceDest: parsedNewBalanceDest,
        },
      },
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={20} color={appColors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>New Transfer</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.recipientArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ML</Text>
          </View>
          <Text style={styles.recipientName}>Fraud Dataset Input</Text>
          <Text style={styles.recipientMeta}>Enter transfer features for analytics</Text>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.currency}>Rs</Text>
          <TextInput
            value={amount}
            editable={false}
            placeholder="0"
            placeholderTextColor="rgba(231,255,233,0.35)"
            style={styles.amountInput}
          />
        </View>

        <Text style={styles.formSectionTitle}>ML Dataset Details</Text>

        <TextInput
          value={transactionIdInput}
          onChangeText={setTransactionIdInput}
          placeholder="Transaction_ID"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
          autoCapitalize="none"
        />

        <TextInput
          value={step}
          onChangeText={setStep}
          placeholder="Step (hour index)"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
          keyboardType="number-pad"
        />

        <View style={styles.typeRow}>
          {["CASH_IN", "CASH_OUT", "DEBIT", "PAYMENT", "TRANSFER"].map((typeOption) => (
            <Pressable
              key={typeOption}
              style={[styles.typePill, transactionType === typeOption && styles.typePillActive]}
              onPress={() => setTransactionType(typeOption)}
            >
              <Text style={[styles.typePillText, transactionType === typeOption && styles.typePillTextActive]}>
                {typeOption}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          value={oldBalanceOrg}
          onChangeText={setOldBalanceOrg}
          placeholder="Old balance"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
          keyboardType="decimal-pad"
        />

        <TextInput
          value={newBalanceOrg}
          onChangeText={setNewBalanceOrg}
          placeholder="New balance"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
          keyboardType="decimal-pad"
        />

        <TextInput
          value={oldBalanceDest}
          onChangeText={setOldBalanceDest}
          placeholder="Old balance destination"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
          keyboardType="decimal-pad"
        />

        <TextInput
          value={newBalanceDest}
          onChangeText={setNewBalanceDest}
          placeholder="New balance destination"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
          keyboardType="decimal-pad"
        />

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.sendBtn, !canProceed && styles.sendBtnDisabled]}
            onPress={sendForFraudCheck}
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
  recipientArea: {
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  avatar: {
    height: 68,
    width: 68,
    borderRadius: 34,
    backgroundColor: "#143021",
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: appColors.text,
    fontWeight: "800",
    fontSize: 20,
  },
  recipientName: {
    color: appColors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  recipientMeta: {
    color: appColors.textMuted,
    fontSize: 13,
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
  reasonInput: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0b1813",
    color: appColors.text,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  formSectionTitle: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 4,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typePill: {
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#0b1813",
  },
  typePillActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  typePillText: {
    color: appColors.textMuted,
    fontWeight: "700",
    fontSize: 12,
  },
  typePillTextActive: {
    color: "#03280f",
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
