const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  return res.json({
    status: "ok",
    service: "upi-fraud-api",
    version: "1.0.0",
    time: new Date().toISOString(),
  });
});

module.exports = router;
