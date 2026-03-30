import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { appColors } from "../constants/theme";

const QUICK_ACTIONS = [
  "Show fraud summary",
  "Recent high-risk transactions",
  "How to tune threshold?",
];

const BOT_RESPONSES = {
  "Show fraud summary":
    "Today: 38 fraud events detected, 112 transactions flagged, model accuracy at 99.3%.",
  "Recent high-risk transactions":
    "Top high-risk IDs: TXN-9182, TXN-9178, TXN-9166. Open Transactions for details.",
  "How to tune threshold?":
    "Go to Settings and adjust fraud threshold. Recommended production range is 60 to 70.",
};

export default function AssistantSheet() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi, I am UPI Guard Assistant. Ask about fraud alerts or model health." },
  ]);

  const onlineLabel = useMemo(() => "Assistant Online", []);

  const onAction = (action) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: action },
      { role: "bot", text: BOT_RESPONSES[action] || "I can help with fraud metrics, alerts and model status." },
    ]);
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {open ? (
        <View style={styles.panel}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>UPI Guard Assistant</Text>
              <Text style={styles.status}>{onlineLabel}</Text>
            </View>
            <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>x</Text>
            </Pressable>
          </View>
          <View style={styles.msgList}>
            {messages.slice(-4).map((msg, idx) => (
              <View key={`${msg.role}-${idx}`} style={[styles.msg, msg.role === "user" ? styles.msgUser : styles.msgBot]}>
                <Text style={styles.msgText}>{msg.text}</Text>
              </View>
            ))}
          </View>
          <View style={styles.actions}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable key={action} onPress={() => onAction(action)} style={styles.chip}>
                <Text style={styles.chipText}>{action}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <Pressable style={styles.fab} onPress={() => setOpen((v) => !v)}>
        <Text style={styles.fabText}>{open ? "Close Chat" : "AI Assistant"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: 14,
    bottom: 18,
    left: 14,
    alignItems: "flex-end",
  },
  panel: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#08140f",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: appColors.text,
    fontWeight: "700",
    fontSize: 15,
  },
  status: {
    color: appColors.textMuted,
    fontSize: 11,
  },
  closeBtn: {
    height: 28,
    width: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: appColors.primarySoft,
  },
  closeTxt: {
    color: appColors.primary,
    fontWeight: "700",
  },
  msgList: {
    gap: 6,
  },
  msg: {
    borderRadius: 12,
    padding: 8,
  },
  msgBot: {
    backgroundColor: "rgba(0, 255, 65, 0.12)",
  },
  msgUser: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignSelf: "flex-end",
  },
  msgText: {
    color: appColors.text,
    fontSize: 12,
    lineHeight: 17,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: appColors.primarySoft,
  },
  chipText: {
    color: appColors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  fab: {
    backgroundColor: appColors.primary,
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  fabText: {
    color: "#03280f",
    fontSize: 13,
    fontWeight: "800",
  },
});
