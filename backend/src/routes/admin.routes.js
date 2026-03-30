const express = require("express");

const { getUserSummary } = require("../controllers/admin.controller");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/users/:userId/summary", requireAuth, requireRole(["admin"]), getUserSummary);

module.exports = router;
