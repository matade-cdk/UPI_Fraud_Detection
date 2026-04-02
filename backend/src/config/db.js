const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDB() {
  await mongoose.connect(env.MONGO_URI, {
    dbName: env.MONGO_DB_NAME,
  });
}

module.exports = { connectDB };
