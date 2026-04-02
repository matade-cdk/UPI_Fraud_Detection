const express = require("express");

const { signup, login, me, listUsers } = require("../controllers/auth.controller");
const { requireAuth, requireRole } = require("../middlewares/auth");
const { env } = require("../config/env");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me);

if (env.ALLOW_PUBLIC_USERS_ENDPOINT) {
  router.get("/users", listUsers);
} else {
  router.get("/users", requireAuth, requireRole(["admin"]), listUsers);
}

module.exports = router;
