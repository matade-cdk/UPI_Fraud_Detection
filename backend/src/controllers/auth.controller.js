const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { env } = require("../config/env");
const { signAccessToken } = require("../utils/token");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function signup(req, res) {
  try {
    const username = String(req.body?.username || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (username.length < 2) {
      return res.status(400).json({ message: "Username must be at least 2 characters" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash, role: "user" });
    const accessToken = signAccessToken(user);

    return res.status(201).json({ accessToken, user: user.toSafeJSON() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to sign up", error: error.message });
  }
}

async function login(req, res) {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!EMAIL_REGEX.test(email) || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken(user);
    return res.json({ accessToken, user: user.toSafeJSON() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login", error: error.message });
  }
}

async function me(req, res) {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: user.toSafeJSON() });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
}

async function listUsers(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return res.json({
      items: users.map((user) => user.toSafeJSON()),
      pagination: { page, limit, total },
      public: env.ALLOW_PUBLIC_USERS_ENDPOINT,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
}

module.exports = { signup, login, me, listUsers };
