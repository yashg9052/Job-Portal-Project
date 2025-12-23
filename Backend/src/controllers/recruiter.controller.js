import { Job_model } from "../models/job.model.js";
import { User_model } from "../models/user.model.js";
import { job_schema } from "../validators/recruiter.validators.js";

export const getRecruiterDashboard = async (req, res) => {
  try {
    // Assuming req.user is populated by the authentication middleware
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiterId = req.user._id;
    const totalJobs = await Job_model.countDocuments({ recruiter: recruiterId });
    const openJobs = await Job_model.countDocuments({ recruiter: recruiterId, status: "OPEN" });
    const closedJobs = await Job_model.countDocuments({ recruiter: recruiterId, status: "CLOSED" });
    return res.status(200).json({ totalJobs, openJobs, closedJobs });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRecruiterProfile = async (req, res) => {
  try {
    // Assuming req.user is populated by the authentication middleware
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiterId = req.user._id;
    const user = await User_model.findById(recruiterId).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postCreateJob = async (req, res) => {
  try {
    // Assuming req.user is populated by the authentication middleware  
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }   
    const recruiterId = req.user._id;
    const parsed = job_schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const newJob = await Job_model.create({
      ...parsed.data,
      recruiter: recruiterId,
    });
    return res.status(201).json({ job: newJob });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });

  }}

export const getRecruiterJobs = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiterId = req.user._id;
    const jobs = await Job_model.find({ recruiter: recruiterId }).sort({ createdAt: -1 });
    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

  