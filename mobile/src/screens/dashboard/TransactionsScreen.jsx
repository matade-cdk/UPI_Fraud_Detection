import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import ScreenContainer from "../../components/ScreenContainer";
import RiskBadge from "../../components/RiskBadge";
import SectionCard from "../../components/SectionCard";
import { transactions } from "../../constants/mockData";
import { appColors } from "../../constants/theme";

export default function TransactionsScreen() {
  return (
    <ScreenContainer>
      <Text style={styles.pageTitle}>Transactions</Text>
      <Text style={styles.pageSub}>Full transaction ledger</Text>

      <SectionCard title="All Transactions" subtitle="Paginated list (mock)">
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.id}>{item.id}</Text>
                <Text style={styles.meta}>{item.upi}</Text>
                <Text style={styles.meta}>{item.time}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.amount}>{item.amount}</Text>
                <Text style={styles.score}>Score {item.score}</Text>
                <RiskBadge level={item.risk} />
              </View>
            </View>
          )}
        />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: appColors.text,
    marginTop: 8,
    fontSize: 26,
    fontWeight: "800",
  },
  pageSub: {
    color: appColors.textMuted,
    marginTop: -4,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  id: {
    color: appColors.text,
    fontWeight: "700",
  },
  amount: {
    color: appColors.text,
    fontWeight: "800",
  },
  meta: {
    color: appColors.textMuted,
    fontSize: 12,
  },
  score: {
    color: appColors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  separator: {
    height: 12,
  },
});
