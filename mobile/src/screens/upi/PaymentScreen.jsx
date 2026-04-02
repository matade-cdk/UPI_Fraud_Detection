import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenContainer from "../../components/ScreenContainer";
import { appColors } from "../../constants/theme";

const TRANSACTION_TYPES = ["CASH_IN", "CASH_OUT", "DEBIT", "PAYMENT", "TRANSFER"];

export default function PaymentScreen({ navigation, route }) {
  const recipient = route?.params?.recipient || { trustScore: 70 };
  const isScanPay = route?.params?.actionType === "Scan Pay";

  const [transactionType, setTransactionType] = useState(recipient.transactionType || "TRANSFER");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const [transactionIdInput, setTransactionIdInput] = useState("");
  const [step, setStep] = useState(String(new Date().getHours()));
  const [oldBalanceOrg, setOldBalanceOrg] = useState("");
  const [newBalanceOrg, setNewBalanceOrg] = useState("");
  const [oldBalanceDest, setOldBalanceDest] = useState("");
  const [newBalanceDest, setNewBalanceDest] = useState("");

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

  const canProceed = useMemo(() => (isScanPay ? true : hasDatasetFields), [hasDatasetFields, isScanPay]);

  function handleProceed() {
    if (!canProceed) {
      Alert.alert("Missing data", "Please fill all transfer details before proceeding.");
      return;
    }

    const transactionId = transactionIdInput.trim() || `TXN-${Date.now()}`;
    const draft = {
      transactionId,
      userId: "u_current",
      receiverName: recipient.name || "Manual Transfer",
      upiRecipient: recipient.vpa || "manual@upi",
      trustScore: recipient.trustScore || 70,
      reason: isScanPay ? "UPI QR scan payment" : "Manual transfer dataset entry",
      location: "Unknown",
      actionType: isScanPay ? "Scan Pay" : "Transfer",
      step: isScanPay ? Number(new Date().getHours()) : parsedStep,
      transactionType: isScanPay ? "TRANSFER" : transactionType,
      oldbalanceOrg: isScanPay ? 0 : parsedOldBalanceOrg,
      newbalanceOrig: isScanPay ? 0 : parsedNewBalanceOrg,
      oldbalanceDest: isScanPay ? 0 : parsedOldBalanceDest,
      newbalanceDest: isScanPay ? 0 : parsedNewBalanceDest,
    };

    navigation.navigate("PaymentAmount", {
      draft,
      presetAmount: recipient.amount ? String(recipient.amount) : "",
    });
  }

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
            <Text style={styles.avatarText}>UPI</Text>
          </View>
          <Text style={styles.recipientName}>{recipient.name || "Scanned Recipient"}</Text>
          <Text style={styles.recipientMeta}>{recipient.vpa || "manual@upi"}</Text>
        </View>

        {isScanPay ? (
          <View style={styles.scanSummaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Name</Text>
              <Text style={styles.summaryValue}>{recipient.name || "Scanned User"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>UPI ID</Text>
              <Text style={styles.summaryValue}>{recipient.vpa || "unknown@upi"}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Type</Text>
              <Text style={styles.summaryValue}>TRANSFER</Text>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.formSectionTitle}>Transfer Details</Text>

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

            <View style={styles.dropdownWrap}>
              <Text style={styles.dropdownLabel}>Transaction Type</Text>
              <Pressable style={styles.dropdownBtn} onPress={() => setTypeDropdownOpen(true)}>
                <Text style={styles.dropdownValue}>{transactionType}</Text>
                <MaterialCommunityIcons name="chevron-down" size={22} color={appColors.textMuted} />
              </Pressable>
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
          </>
        )}

        <Pressable style={[styles.proceedBtn, !canProceed && styles.proceedBtnDisabled]} onPress={handleProceed} disabled={!canProceed}>
          <Text style={styles.proceedBtnText}>Proceed to Amount</Text>
        </Pressable>

        <Modal transparent visible={typeDropdownOpen} animationType="fade" onRequestClose={() => setTypeDropdownOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setTypeDropdownOpen(false)}>
            <View style={styles.dropdownMenu}>
              {TRANSACTION_TYPES.map((typeOption) => (
                <Pressable
                  key={typeOption}
                  style={[styles.dropdownItem, transactionType === typeOption && styles.dropdownItemActive]}
                  onPress={() => {
                    setTransactionType(typeOption);
                    setTypeDropdownOpen(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, transactionType === typeOption && styles.dropdownItemTextActive]}>
                    {typeOption}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
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
  formSectionTitle: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 14,
    marginTop: 4,
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
  scanSummaryCard: {
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
  dropdownWrap: {
    gap: 6,
  },
  dropdownLabel: {
    color: appColors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  dropdownBtn: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0b1813",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownValue: {
    color: appColors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  proceedBtn: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: appColors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  proceedBtnDisabled: {
    opacity: 0.5,
  },
  proceedBtnText: {
    color: "#03280f",
    fontWeight: "800",
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 24,
  },
  dropdownMenu: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.panel,
    padding: 10,
    gap: 6,
  },
  dropdownItem: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#0b1813",
  },
  dropdownItemActive: {
    backgroundColor: appColors.primary,
  },
  dropdownItemText: {
    color: appColors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  dropdownItemTextActive: {
    color: "#03280f",
  },
});