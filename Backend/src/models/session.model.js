import mongoose from "mongoose";

const session_schema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userAgent: { type: String },
  ipAddress: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,  
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
  },
});

// TTL index to remove expired refresh token docs automatically when expiresAt is set
session_schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const session_model = mongoose.model(
  "Session-table",
  session_schema
);
