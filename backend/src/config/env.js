const dotenv = require("dotenv");

dotenv.config();

const env = {
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || "",
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || "upi_fraud_detection",
  JWT_SECRET: process.env.JWT_SECRET || "dev_jwt_secret_change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  ALLOW_PUBLIC_USERS_ENDPOINT: String(process.env.ALLOW_PUBLIC_USERS_ENDPOINT || "false") === "true",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
};

function validateEnv() {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is required in backend/.env");
  }
}

module.exports = { env, validateEnv };
