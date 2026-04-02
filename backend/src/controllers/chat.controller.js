const { env } = require("../config/env");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

function buildAssistantInstruction() {
  return [
    "You are UPI Guard AI, a fintech safety and payments assistant.",
    "Use a practical, concise tone.",
    "When relevant, explain spending, fraud risk, and safe next actions.",
    "If asked for financial advice, provide educational guidance only.",
    "Prefer short sections and bullet points.",
    "If data is missing, say what is missing instead of guessing.",
  ].join(" ");
}

async function buildUserContext(userId) {
  const user = await User.findById(userId).lean();
  if (!user) {
    return "User profile not found.";
  }

  const transactions = await Transaction.find({ userId })
    .sort({ time: -1 })
    .limit(8)
    .lean();

  const totalTransactions = transactions.length;
  const totalSpend = transactions
    .filter((txn) => (txn.transactionType || "expense") !== "income" && txn.status !== "blocked")
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);
  const blocked = transactions.filter((txn) => txn.status === "blocked").length;
  const flagged = transactions.filter((txn) => txn.status === "flagged").length;

  const recentText = transactions.length
    ? transactions
        .map((txn) => {
          const location = txn.location || "Unknown";
          const amount = Number(txn.amount || 0);
          const status = txn.status || "success";
          const receiver = txn.receiverName || txn.upiRecipient || "Unknown";
          return `- ${receiver}, INR ${amount}, ${status}, ${location}, ${new Date(txn.time).toISOString()}`;
        })
        .join("\n")
    : "- No recent transactions";

  return [
    `User: ${user.username} (${user.email})`,
    `Role: ${user.role}`,
    `Recent transaction count: ${totalTransactions}`,
    `Recent spend (INR): ${totalSpend}`,
    `Recent risk counts: flagged=${flagged}, blocked=${blocked}`,
    "Recent transactions:",
    recentText,
  ].join("\n");
}

async function sendChatMessage(req, res) {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    if (!env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "GEMINI_API_KEY is not configured" });
    }

    const contextText = await buildUserContext(req.auth?.userId);

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `Assistant instructions:\n${buildAssistantInstruction()}` }],
          },
          {
            role: "user",
            parts: [{ text: `User context:\n${contextText}` }],
          },
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          topP: 0.9,
          maxOutputTokens: 700,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Gemini API request failed",
        error: data?.error?.message || "Unknown Gemini error",
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("\n")
        .trim() || "I could not generate a response.";

    return res.json({ reply: text });
  } catch (error) {
    return res.status(500).json({ message: "Failed to process chat message", error: error.message });
  }
}

module.exports = { sendChatMessage };
