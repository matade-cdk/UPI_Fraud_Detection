const app = require("./app");
const { connectDB } = require("./config/db");
const { env, validateEnv } = require("./config/env");

async function startServer() {
  validateEnv();
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
