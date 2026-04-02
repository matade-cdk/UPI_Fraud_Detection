const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const { connectDB } = require("../src/config/db");
const { validateEnv } = require("../src/config/env");
const User = require("../src/models/User");
const Transaction = require("../src/models/Transaction");

async function seedUsers() {
  const filePath = path.join(__dirname, "..", "data", "users.seed.json");
  const items = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const item of items) {
    const passwordHash = await bcrypt.hash(item.password, 10);

    await User.findOneAndUpdate(
      { email: item.email.toLowerCase() },
      {
        username: item.username,
        email: item.email.toLowerCase(),
        passwordHash,
        role: item.role || "user",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

async function seedTransactions() {
  const filePath = path.join(__dirname, "..", "data", "transactions.seed.json");
  const items = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const item of items) {
    await Transaction.findOneAndUpdate(
      { txnId: item.txnId },
      {
        txnId: item.txnId,
        receiverName: item.receiverName,
        upiRecipient: item.upiRecipient,
        amount: item.amount,
        currency: item.currency || "INR",
        score: item.score || 0,
        status: item.status || "success",
        time: item.time ? new Date(item.time) : new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

async function run() {
  validateEnv();
  await connectDB();

  await Promise.all([seedUsers(), seedTransactions()]);

  console.log("Seed completed successfully.");
  process.exit(0);
}

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
