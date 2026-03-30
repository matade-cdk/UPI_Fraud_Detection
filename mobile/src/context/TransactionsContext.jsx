import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchRecentTransactions, saveTransaction } from "../services/fraudApi";
import { useAuth } from "./AuthContext";

const OPENING_BALANCE = 100000;

const TransactionsContext = createContext(null);

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setTransactions([]);
        return;
      }

      const remoteItems = await fetchRecentTransactions(25);
      if (!remoteItems.length) {
        setTransactions([]);
        return;
      }

      const normalizedRemote = remoteItems.map((item) => ({
        _id: item.id || item._id || `txn-${Date.now()}-${Math.random()}`,
        receiverName: item.receiverName || item.upiRecipient || "Unknown",
        amount: Number(item.amount || 0),
        transactionType: item.transactionType || "expense",
        status: item.status || "success",
        timestamp: item.time || item.timestamp || new Date().toISOString(),
        merchantTrustScore: Number(item.score || item.merchantTrustScore || 0),
        upiId: item.upiRecipient || item.upiId || "unknown@upi",
        location: item.location || "Unknown",
        reason: item.reason || "",
      }));

      setTransactions(normalizedRemote);
    };

    load();
  }, [token]);

  const addTransaction = async (txn) => {
    const normalized = {
      _id: txn._id || `txn-${Date.now()}`,
      receiverName: txn.receiverName || "Unknown",
      amount: Number(txn.amount || 0),
      transactionType: txn.transactionType || "expense",
      status: txn.status || "success",
      timestamp: txn.timestamp || new Date().toISOString(),
      merchantTrustScore: Number(txn.merchantTrustScore || 0),
      upiId: txn.upiId || "unknown@upi",
      location: txn.location || "Unknown",
      reason: txn.reason || "",
    };

    setTransactions((prev) => [normalized, ...prev]);

    await saveTransaction({
      id: normalized._id,
      userId: user?.userId,
      receiverName: normalized.receiverName,
      upiRecipient: normalized.upiId,
      amount: normalized.amount,
      score: normalized.merchantTrustScore,
      status: normalized.status,
      time: normalized.timestamp,
      currency: "INR",
      transactionType: normalized.transactionType,
      location: normalized.location,
      reason: normalized.reason,
    });

    return normalized;
  };

  const walletSummary = useMemo(() => {
    const income = transactions
      .filter((txn) => txn.transactionType === "income" && txn.status === "success")
      .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);

    const expense = transactions
      .filter((txn) => txn.transactionType !== "income" && txn.status !== "blocked")
      .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);

    const totalBalance = OPENING_BALANCE + income - expense;

    return {
      openingBalance: OPENING_BALANCE,
      income,
      expense,
      totalBalance,
    };
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
      walletSummary,
    }),
    [transactions, walletSummary]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return ctx;
}
