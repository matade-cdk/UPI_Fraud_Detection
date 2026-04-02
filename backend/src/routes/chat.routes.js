const express = require("express");

const { sendChatMessage } = require("../controllers/chat.controller");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/message", requireAuth, sendChatMessage);

module.exports = router;
