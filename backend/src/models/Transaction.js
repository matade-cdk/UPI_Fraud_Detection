const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    txnId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    receiverName: { type: String, required: true },
    upiRecipient: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ["income", "expense"], default: "expense" },
    currency: { type: String, default: "INR" },
    score: { type: Number, default: 0 },
    status: { type: String, enum: ["success", "flagged", "blocked"], default: "success" },
    location: { type: String, default: "Unknown" },
    reason: { type: String, default: "" },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
