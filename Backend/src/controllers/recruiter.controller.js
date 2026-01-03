import { Job_model } from "../models/job.model.js";
import { Recruiter_model } from "../models/recruiter.model.js";
import { User_model } from "../models/user.model.js";
import { job_schema } from "../validators/job.validators.js";
import { Applicant_model } from "../models/applicant.model.js";

export const getRecruiterDashboard = async (req, res) => {
  try {
    // Assuming req.user is populated by the authentication middleware
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiterId = req.user._id;
    const totalJobs = await Job_model.countDocuments({
      recruiter: recruiterId,
    });
    const openJobs = await Job_model.countDocuments({
      recruiter: recruiterId,
      status: "OPEN",
    });
    const closedJobs = await Job_model.countDocuments({
      recruiter: recruiterId,
      status: "CLOSED",
    });
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
    const user = await User_model.findById(recruiterId, {
      _id: 1,
      name: 1,
      email: 1,
      provider: 1,
      createdAt: 1,
    });
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
    const recruiter = await Recruiter_model.findOne({ userId: req.user._id });
    const parsed = job_schema.safeParse(req.body);
    console.log(parsed);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const newJob = await Job_model.create({
      ...parsed.data,
      recruiter: recruiter.name,
      color: recruiter.color,
    });

    return res
      .status(201)
      .json({ message: "job created succesfully", job: newJob });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getActiveJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter" || !req.user) {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiter = req.user;

    const openJobs = await Job_model.find({
      recruiter: recruiter.name,
      status: "OPEN",
      deleted: false,
    })
      .select("-recruiter")
      .sort({ createdAt: -1 });

    return res.status(200).json({ openJobs });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getClosedJobs = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiterId = req.user._id;
    const closedJobs = await Job_model.find({
      recruiter: recruiterId,
      status: "CLOSED",
      deleted: false,
    })
      .select("-recruiter")
      .sort({ createdAt: -1 });
    return res.status(200).json({ closedJobs });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const putUpdateJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiter = req.user;
    const { jobId } = req.params;
    const parsed = job_schema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const job = await Job_model.findOneAndUpdate(
      { _id: jobId, recruiter: recruiter.name },
      { $set: parsed.data },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ error: "Job not found or unauthorized" });
    }
    return res.status(200).json({ job });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiter = req.user;
    const { jobId } = req.params;

    const job = await Job_model.findOneAndUpdate(
      {
        _id: jobId,
        recruiter: recruiter.name,
      },
      { $set: { deleted: true, deletedAt: new Date() } }
    );
    if (!job) {
      return res.status(404).json({ error: "Job not found or unauthorized" });
    }
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const patchcloseJob = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({ error: "Forbidden: Access is denied" });
    }
    const recruiter = req.user;
    const { jobId } = req.params;

    const job = await Job_model.findOneAndUpdate(
      {
        _id: jobId,
        recruiter: recruiter.name,
        status: "OPEN",
      },
      { $set: { status: "CLOSED", updatedAt: new Date() } }
    );
    if (!job) {
      return res.status(404).json({ error: "Job not found or unauthorized" });
    }
    return res.status(200).json({ message: "Job closed successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getApplicants = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "recruiter") {
      return res.status(403).json({
        error: "Forbidden: Recruiter access only",
      });
    }

    const { jobId } = req.params;

    const applicants = await Applicant_model.find(
      { _id:jobId, deleted: false },
      {
        user_id: 0,
        deleted: 0,
        createdAt: 0,
        updatedAt: 0,
        savedJobs: 0,
        __v: 0,
      }
    );

    return res.status(200).json({
      totalApplicants: applicants.length,
      applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
