import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
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

function initialFromName(name = "?") {
  return name
    .split(" ")
    .map((v) => v[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PaymentScreen({ navigation, route }) {
  const recipient = route?.params?.recipient || {
    name: "",
    vpa: "",
    bank: "UPI",
    trustScore: 70,
  };
  const actionType = route?.params?.actionType || "Send";

  const [receiverName, setReceiverName] = useState(recipient.name || "");
  const [receiverUpi, setReceiverUpi] = useState(recipient.vpa || "");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [location, setLocation] = useState("Bengaluru");
  const [checking, setChecking] = useState(false);

  const canProceed = useMemo(
    () => Number(amount || 0) > 0 && receiverName.trim().length > 1 && receiverUpi.trim().length > 3,
    [amount, receiverName, receiverUpi]
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

    setChecking(true);
    const payload = {
      transactionId: `TXN-${Date.now()}`,
      userId: "u_current",
      amount: Number(amount),
      upiRecipient: receiverUpi.trim(),
      deviceFingerprint: "mobile-device-fp",
      ipAddress: "0.0.0.0",
      geo: { lat: 12.97, lng: 77.59 },
      timestamp: new Date().toISOString(),
      trustScore: recipient.trustScore || 70,
      reason,
      location,
      actionType,
    };

    const result = await assessTransactionRisk(payload);
    setChecking(false);

    navigation.navigate("PaymentDecision", {
      transaction: {
        amount: Number(amount),
        receiverName: receiverName.trim(),
        upiId: receiverUpi.trim(),
        trustScore: recipient.trustScore || 70,
        isFraudulent: Boolean(result.risky),
        fraudReason: result.reason || "No suspicious pattern detected.",
        txnId: payload.transactionId,
        timestamp: new Date(),
        location,
        reason,
      },
    });
  };

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={20} color={appColors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Paying money</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.recipientArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialFromName(receiverName || "?")}</Text>
          </View>
          <Text style={styles.recipientName}>{receiverName || "Enter Receiver"}</Text>
          <Text style={styles.recipientMeta}>{receiverUpi || "Enter UPI ID"}</Text>
        </View>

        <TextInput
          value={receiverName}
          onChangeText={setReceiverName}
          placeholder="Receiver name"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
        />

        <TextInput
          value={receiverUpi}
          onChangeText={setReceiverUpi}
          placeholder="Receiver UPI ID"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
          autoCapitalize="none"
        />

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

        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder="Enter reason"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
        />

        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          placeholderTextColor="rgba(231,255,233,0.4)"
          style={styles.reasonInput}
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
