const mongoose = require("mongoose");

function generatePublicUserId() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timePart = Date.now().toString(36).toUpperCase();
  return `USR-${timePart}-${randomPart}`;
}

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, index: true, default: generatePublicUserId },
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    userId: this.userId,
    username: this.username,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    lastLoginAt: this.lastLoginAt,
  };
};

module.exports = mongoose.model("User", userSchema);
