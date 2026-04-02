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
    merchantCategory: { type: String, default: "" },
    deviceId: { type: String, default: "" },
    fraudLabel: { type: String, default: "" },
    step: { type: Number, default: 0 },
    oldbalanceOrg: { type: Number, default: 0 },
    newbalanceOrig: { type: Number, default: 0 },
    oldbalanceDest: { type: Number, default: 0 },
    newbalanceDest: { type: Number, default: 0 },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
