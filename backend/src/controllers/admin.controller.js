const User = require("../models/User");
const Transaction = require("../models/Transaction");

async function getUserSummary(req, res) {
  try {
    const publicUserId = String(req.params.userId || "").trim();
    const user = await User.findOne({ userId: publicUserId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const txnQuery = { userId: user._id };

    const [
      totalTransactions,
      flaggedTransactions,
      blockedTransactions,
      totalAmount,
      recentTransactions,
    ] = await Promise.all([
      Transaction.countDocuments(txnQuery),
      Transaction.countDocuments({ ...txnQuery, status: "flagged" }),
      Transaction.countDocuments({ ...txnQuery, status: "blocked" }),
      Transaction.aggregate([
        { $match: txnQuery },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]),
      Transaction.find(txnQuery).sort({ time: -1 }).limit(10).lean(),
    ]);

    return res.json({
      user: user.toSafeJSON(),
      summary: {
        totalTransactions,
        flaggedTransactions,
        blockedTransactions,
        totalAmount: Number(totalAmount?.[0]?.amount || 0),
      },
      recentTransactions: recentTransactions.map((txn) => ({
        id: txn.txnId,
        userId: user.userId,
        receiverName: txn.receiverName,
        upiRecipient: txn.upiRecipient,
        amount: txn.amount,
        currency: txn.currency,
        score: txn.score,
        status: txn.status,
        time: txn.time,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user summary", error: error.message });
  }
}

module.exports = { getUserSummary };
