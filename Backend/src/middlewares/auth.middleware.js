import { User_model } from "../models/user.model.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/auth.services.js";
import { session_model } from "../models/session.model.js";
dotenv.config();
export const authMiddleware = async (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;
    const refresh_token = req.cookies.refresh_token;

    if (!access_token && !refresh_token) {
      return res.status(401).json({ error: "Unauthorized Please login first" });
    }
    if (access_token) {
      try {
        const decoded = jwt.verify(
          access_token,
          process.env.JWT_ACCESS_SECRET_KEY
        );
        req.user = await User_model.findById(decoded.id).select("-password");
        return next();
      } catch (err) {
        console.log("Access token expired or invalid:", err.message);
      }
    }
    if (refresh_token) {
      try {
        const decoded = jwt.verify(
          refresh_token,
          process.env.JWT_REFRESH_SECRET_KEY
        );
        // Ensure the refresh token exists in the RefreshToken collection (single-use rotation)
        const user = await User_model.findById(decoded.id).select("-password");
        if (!user) {
          res.clearCookie("access_token");
          res.clearCookie("refresh_token");
          return res
            .status(401)
            .json({ error: "Unauthorized Please login first" });
        }

        const stored = await session_model.findOne({
          _id: decoded.session_id,
          user: user._id,
          revoked: false,
        });
        if (!stored) {
          // Possible token reuse or logout — reject and clear cookies
          res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          return res
            .status(401)
            .json({ error: "Unauthorized: Invalid refresh token" });
        }
        // Mark the stored session as revoked so it can't be reused (keep record)
        await session_model.updateOne({ _id: stored._id }, { $set: { revoked: true } });
        // Generate new tokens and rotate the refresh token in DB
        const new_access_token = generateAccessToken(user._id);
        const new_refresh_token = generateRefreshToken(user._id, stored._id);

        req.user = user;
        res.cookie("access_token", new_access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        res.cookie("refresh_token", new_refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        return next();
      } catch (err) {
        console.log("Refresh token expired or invalid:", err.message);
        return res
          .status(401)
          .json({ error: "Unauthorized Please login first" });
      }
    }
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

