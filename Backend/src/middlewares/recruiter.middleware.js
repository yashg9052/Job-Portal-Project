import { User_model } from "../models/user.model.js";

export const recruiterMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    req.user = await User_model.findById(req.user._id).select("-password");
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
