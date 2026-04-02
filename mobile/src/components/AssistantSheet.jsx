import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appColors } from "../constants/theme";
import { sendChatMessage } from "../services/chatApi";

const QUICK_ACTIONS = [
  "Show my spending risk summary",
  "How can I avoid UPI fraud?",
  "Explain this week expense trend",
];

export default function AssistantSheet() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi, I am UPI Guard AI assistant. Ask anything about your payments or fraud safety." },
  ]);

  const onlineLabel = useMemo(() => (loading ? "Thinking..." : "Assistant Online"), [loading]);

  async function askBot(text) {
    const query = String(text || "").trim();
    if (!query || loading) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setInput("");
    setLoading(true);

    const result = await sendChatMessage(query);

    setLoading(false);
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: result.ok
          ? result.reply
          : `Unable to get AI response right now. ${result.error || "Please try again."}`,
      },
    ]);
  }

  return (
    <>
      <View style={[styles.wrap, { bottom: insets.bottom + 88 }]} pointerEvents="box-none">
      <Pressable style={styles.fab} onPress={() => setOpen(true)}>
        <MaterialCommunityIcons name="robot-outline" size={30} color="#03280f" />
      </Pressable>
      </View>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.fullScreen}>
          <View style={[styles.header, { paddingTop: insets.top + 8 }]}> 
            <View>
              <Text style={styles.title}>UPI Guard AI</Text>
              <Text style={styles.status}>{onlineLabel}</Text>
            </View>
            <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeTxt}>x</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.msgList} contentContainerStyle={{ gap: 8, paddingBottom: 14 }}>
            {messages.map((msg, idx) => (
              <View key={`${msg.role}-${idx}`} style={[styles.msg, msg.role === "user" ? styles.msgUser : styles.msgBot]}>
                <Text style={styles.msgText}>{msg.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable key={action} onPress={() => askBot(action)} style={styles.chip}>
                <Text style={styles.chipText}>{action}</Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) }]}> 
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask your AI assistant"
              placeholderTextColor={appColors.textMuted}
              style={styles.input}
              editable={!loading}
            />
            <Pressable style={styles.sendBtn} onPress={() => askBot(input)} disabled={loading}>
              <Text style={styles.sendText}>{loading ? "..." : "Send"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: 16,
    bottom: 88,
    alignItems: "flex-end",
    zIndex: 999,
    elevation: 10,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: "#08140f",
    paddingHorizontal: 14,
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
    flex: 1,
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
    marginBottom: 2,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 4,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: "#0d1f17",
    color: appColors.text,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
  },
  sendBtn: {
    borderRadius: 10,
    backgroundColor: appColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 52,
    alignItems: "center",
  },
  sendText: {
    color: "#03280f",
    fontWeight: "800",
    fontSize: 12,
  },
  fab: {
    backgroundColor: appColors.primary,
    borderRadius: 999,
    width: 66,
    height: 66,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#07130f",
  },
});
