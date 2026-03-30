const Transaction = require("../models/Transaction");
const User = require("../models/User");

async function getTransactions(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;
    const query = req.auth.role === "admin" ? {} : { userId: req.auth.userId };

    const [items, total] = await Promise.all([
      Transaction.find(query).sort({ time: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(query),
    ]);

    return res.json({
      items: items.map((t) => ({
        id: t.txnId,
        userId: t.userId,
        receiverName: t.receiverName,
        upiRecipient: t.upiRecipient,
        amount: t.amount,
        transactionType: t.transactionType,
        currency: t.currency,
        score: t.score,
        status: t.status,
        location: t.location,
        reason: t.reason,
        time: t.time,
      })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
}

async function createTransaction(req, res) {
  try {
    const body = req.body || {};
    const txnId = body.id || body.txnId;

    if (!txnId || !body.receiverName || !body.upiRecipient || typeof body.amount !== "number") {
      return res.status(400).json({ message: "Missing required transaction fields" });
    }

    const payload = {
      txnId,
      userId: req.auth.userId,
      receiverName: body.receiverName,
      upiRecipient: body.upiRecipient,
      amount: body.amount,
      transactionType: body.transactionType || "expense",
      currency: body.currency || "INR",
      score: Number(body.score || 0),
      status: body.status || "success",
      location: body.location || "Unknown",
      reason: body.reason || "",
      time: body.time ? new Date(body.time) : new Date(),
    };

    const saved = await Transaction.findOneAndUpdate({ txnId }, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).lean();

    return res.status(201).json({
      id: saved.txnId,
      userId: saved.userId,
      receiverName: saved.receiverName,
      upiRecipient: saved.upiRecipient,
      amount: saved.amount,
      transactionType: saved.transactionType,
      currency: saved.currency,
      score: saved.score,
      status: saved.status,
      location: saved.location,
      reason: saved.reason,
      time: saved.time,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save transaction", error: error.message });
  }
}

async function getMyTransactions(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Transaction.find({ userId: req.auth.userId }).sort({ time: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments({ userId: req.auth.userId }),
    ]);

    return res.json({
      items: items.map((t) => ({
        id: t.txnId,
        userId: t.userId,
        receiverName: t.receiverName,
        upiRecipient: t.upiRecipient,
        amount: t.amount,
        transactionType: t.transactionType,
        currency: t.currency,
        score: t.score,
        status: t.status,
        location: t.location,
        reason: t.reason,
        time: t.time,
      })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user transactions", error: error.message });
  }
}

async function getTransactionsByPublicUserId(req, res) {
  try {
    const publicUserId = String(req.params.userId || "").trim();
    const user = await User.findOne({ userId: publicUserId }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const query = { userId: user._id };
    const [items, total] = await Promise.all([
      Transaction.find(query).sort({ time: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(query),
    ]);

    return res.json({
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      items: items.map((t) => ({
        id: t.txnId,
        userId: user.userId,
        receiverName: t.receiverName,
        upiRecipient: t.upiRecipient,
        amount: t.amount,
        transactionType: t.transactionType,
        currency: t.currency,
        score: t.score,
        status: t.status,
        location: t.location,
        reason: t.reason,
        time: t.time,
      })),
      pagination: { page, limit, total },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions for user", error: error.message });
  }
}

module.exports = { getTransactions, createTransaction, getMyTransactions, getTransactionsByPublicUserId };
