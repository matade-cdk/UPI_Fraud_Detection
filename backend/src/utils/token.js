const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      userId: user.userId,
      email: user.email,
      role: user.role,
      username: user.username,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

module.exports = { signAccessToken };
