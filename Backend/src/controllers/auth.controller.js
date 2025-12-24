import { User_model } from "../models/user.model.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validators/auth.validators.js";
import {
  createUser,
  finduserbyEmail,
  authenticateUser,
  hashPassword,
  verifyPassword,
} from "../services/auth.services.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { session_model } from "../models/session.model.js";
dotenv.config();

export const getRegisterUser = (req, res) => {
  res.send("User Registration page");
};

export const getLoginUser = (req, res) => {
  res.send("User Login page");
};

export const getLogoutUser = (req, res) => {
  try {
    const refresh_token = req.cookies?.refresh_token;
    if (refresh_token) {
      try {
        const decoded = jwt.verify(
          refresh_token,
          process.env.JWT_REFRESH_SECRET_KEY
        );
        
        // remove persisted refresh token(s) for the user
        session_model
          .deleteMany({ _id: decoded.session_id })
          .catch((err) =>
            console.error("Failed to clear session  on logout:", err)
          );
      } catch (err) {
        // token invalid/expired -- ignore DB cleanup
        req.status(401).json({ error: "Unauthorized Please login first" });
      }
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error unable to logout" });
  }
};

export const postRegisterUser = async (req, res) => {
  const result = registerUserSchema.safeParse(req.body);

  if (!result.success) {
    console.log(result.error);
    return res.status(400).json({
      errors: result.error.errors.map((e) => e.message),
    });
  }

  // ✅ validated data
  const data = result.data;
  const { name, email, password, role, provider, deviceId } = data;
  const existingUser = await finduserbyEmail(email);
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }
  let hashedPassword = null;
  if (provider === "local") {
    hashedPassword = await hashPassword(password);
  }

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
    provider,
  });
  
  const user_authenticated = await authenticateUser(req, res, user._id);
  if (!user_authenticated) {
    return res.status(500).json({ error: "Error in authentication" });
  }
  return res.status(200).json({ message: "registered successfully" });
};

export const postLoginUser = async (req, res) => {
  const result = loginUserSchema.safeParse(req.body);

  if (!result.success) {
    console.log(result.error);
    return res.status(400).json({
      errors: result.error.errors.map((e) => e.message),
    });
  }

  const data = result.data;
  const { email, password, provider, deviceId } = data;
  const user = await finduserbyEmail(email);
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  if (provider === "local") {
    if (user.provider !== "local") {
      return res
        .status(400)
        .json({ error: "Please login using your provider" });
    }
    const isValid = await verifyPassword(user.password, password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  }

  const user_authenticated = await authenticateUser(
    req,
    res,
    user._id,
    user.role
  );
  if (!user_authenticated) {
    return res.status(500).json({ error: "Error in authentication" });
  }

  return res.status(200).json({ message: "Login successful" });
};
