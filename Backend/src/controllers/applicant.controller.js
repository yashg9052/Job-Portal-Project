import { Applicant_model } from "../models/applicant.model.js";
import { Job_model } from "../models/job.model.js";

export const getProfile = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });

  }
  const applicantData = await Applicant_model.findOne({ user_id: req.user._id }).select("-__v -deleted -deletedAt");
  return res.status(200).json({ profile: applicantData });
}

export const updateProfile = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { name, skills, resume_url } = req.body;
  const updatedData = await Applicant_model.findOneAndUpdate(
    { user_id: req.user._id },
    { name, skills, resume_url },
    { new: true, runValidators: true }
  ).select("-__v -deleted -deletedAt");
  return res.status(200).json({ profile: updatedData });

}

export const browseJobs = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { skills, experience, location, minSalary, maxSalary } = req.query;

    const pipeline = [
      { $match: { deleted: false } },
    ];

    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
      if (skillsArray.length) pipeline.push({ $match: { skills: { $in: skillsArray } } });
    }

    if (experience) {
      pipeline.push({ $match: { experience: { $regex: experience, $options: "i" } } });
    }

    if (location) {
      pipeline.push({ $match: { location: { $regex: location, $options: "i" } } });
    }

    if (minSalary || maxSalary) {
      pipeline.push({
        $addFields: {
          salaryMinNum: {
            $convert: { input: "$salary.min", to: "double", onError: null, onNull: null },
          },
          salaryMaxNum: {
            $convert: { input: "$salary.max", to: "double", onError: null, onNull: null },
          },
        },
      });

      if (minSalary) pipeline.push({ $match: { salaryMaxNum: { $gte: Number(minSalary) } } });
      if (maxSalary) pipeline.push({ $match: { salaryMinNum: { $lte: Number(maxSalary) } } });
    }

    pipeline.push({ $project: { __v: 0, deleted: 0, deletedAt: 0, salaryMinNum: 0, salaryMaxNum: 0 } });

    const jobData = await Job_model.aggregate(pipeline);
    return res.status(200).json({ jobs: jobData });
  } catch (err) {
    console.error("browseJobs error:", err);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
}

