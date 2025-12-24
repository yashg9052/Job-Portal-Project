import { User_model } from "../models/user.model.js";

export const applicantMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== "applicant") {
        return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    req.user = await User_model.findById(req.user._id).select("-password");
    next();
  } catch (error) {
    return res.status(500).json({ error:"internal Server Error" } );
  } 

};