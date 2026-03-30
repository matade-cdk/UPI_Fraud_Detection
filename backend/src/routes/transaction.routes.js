const express = require("express");

const {
	getTransactions,
	createTransaction,
	getMyTransactions,
	getTransactionsByPublicUserId,
} = require("../controllers/transaction.controller");
const { requireAuth, requireRole } = require("../middlewares/auth");

const router = express.Router();

router.get("/", requireAuth, getTransactions);
router.get("/me", requireAuth, getMyTransactions);
router.get("/user/:userId", requireAuth, requireRole(["admin"]), getTransactionsByPublicUserId);
router.post("/", requireAuth, createTransaction);

module.exports = router;
