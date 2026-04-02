const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function getBearerToken(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7);
}

function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.auth = {
      userId: decoded.sub,
      publicUserId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
      username: decoded.username,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.auth?.role || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
