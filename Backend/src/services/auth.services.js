import argon2 from "argon2";
import { User_model } from "../models/user.model.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { session_model } from "../models/session.model.js";

export const finduserbyEmail = async (email) => {
  // Logic to find a user by email in the database
  const user = await User_model.findOne({ email });
  if (!user) {
    return null;
  }
  return user;
};

export const hashPassword = async (password) => {
  // Logic to hash the password using argon2
  return await argon2.hash(password);
};

export const verifyPassword = async (hashedPassword, plainPassword) => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (err) {
    return false;
  }
};

export const createUser = async ({ name, email, password, role, provider }) => {
  // Logic to create a new user in the database
  const newUser = await User_model.create({
    name,
    email,
    password,
    role,
    provider,
  });
  console.log("New User Created:", newUser);
  return newUser;
};

export const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

export const generateRefreshToken = (userId, session_id) => {
  
  const token = jwt.sign(
    { id: userId, session_id },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};
export const createsession = async (req, userId) => {
  
  const session = await session_model.create({
    user: userId,
    userAgent: req.headers["user-agent"] || "",
    ipAddress: req.clientIp || req.ip || "",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });
  return session;
};
export const authenticateUser = async (req, res, id, role) => {
  try {
    // Revoke any existing active sessions for this user to rotate sessions on new authentication
    await session_model.updateMany({ user: id, revoked: false }, { $set: { revoked: true } });

    const session = await createsession(req, id);
    const access_token = generateAccessToken(id);
    const refresh_token = generateRefreshToken(id, session._id);
    if (!access_token || !refresh_token) {
      return null;
    }
    // Persist the refresh token in its own collection. Remove previous tokens for this user.

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return true;
  } catch (error) {
    console.error("Error in authentication:", error);
  }
};

