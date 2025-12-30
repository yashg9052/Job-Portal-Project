import { Applicant_model } from "../models/applicant.model.js";
import { application_model } from "../models/job.applications.model.js";
import { Job_model } from "../models/job.model.js";
import { Recruiter_model } from "../models/recruiter.model.js";
import { applicationSchema } from "../validators/application.validator.js";

export const getProfile = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const applicantData = await Applicant_model.findOne({
    user_id: req.user._id,
  }).select("-__v -deleted -deletedAt");
  return res.status(200).json({ profile: applicantData });
};

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
};
export const browseJobs = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const jobs = await Job_model.find({ status: "OPEN", deleted: false })
      .select("-skills  -status -deleted -updatedAt -__v")
      .sort({ createdAt: -1 });
    res.status(200).json({ jobs: jobs });
  } catch (error) {
    console.error("Getjobs error:", err);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const browseJobsFilter = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { skills, experience, location, minSalary, maxSalary } = req.query;

    const pipeline = [{ $match: { deleted: false } }];

    if (skills) {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (skillsArray.length)
        pipeline.push({ $match: { skills: { $in: skillsArray } } });
    }

    if (experience) {
      pipeline.push({
        $match: { experience: { $regex: experience, $options: "i" } },
      });
    }

    if (location) {
      pipeline.push({
        $match: { location: { $regex: location, $options: "i" } },
      });
    }

    if (minSalary || maxSalary) {
      pipeline.push({
        $addFields: {
          salaryMinNum: {
            $convert: {
              input: "$salary.min",
              to: "double",
              onError: null,
              onNull: null,
            },
          },
          salaryMaxNum: {
            $convert: {
              input: "$salary.max",
              to: "double",
              onError: null,
              onNull: null,
            },
          },
        },
      });

      if (minSalary)
        pipeline.push({
          $match: { salaryMaxNum: { $gte: Number(minSalary) } },
        });
      if (maxSalary)
        pipeline.push({
          $match: { salaryMinNum: { $lte: Number(maxSalary) } },
        });
    }

    pipeline.push({
      $project: {
        __v: 0,
        deleted: 0,
        deletedAt: 0,
        salaryMinNum: 0,
        salaryMaxNum: 0,
      },
    });

    const jobData = await Job_model.aggregate(pipeline);
    return res.status(200).json({ jobs: jobData });
  } catch (err) {
    console.error("browseJobs error:", err);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const applyForJob = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    // 1️⃣ Validate request body using Zod
    const { userId, jobId } = req.params;
    const validatedData = applicationSchema.parse(req.body);
    const applicantId=await Applicant_model.findOne({user_id:userId}).select("_id");
    const recruiterId=await Job_model.findOne({_id:jobId}).select("recruiter")
    // 2️⃣ Prevent duplicate application (optional but recommended)
    const existingApplication = await application_model.findOne({
      jobId: jobId,
      applicantId: applicantId._id,
      
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // 3️⃣ Create application
    const application = await application_model.create({
      ...validatedData,
      jobId: jobId,
      applicantId: applicantId._id,
      recruiterId:recruiterId._id,
      status: "applied",
      statusHistory: [
        {
          status: "applied",
        },
      ],
    });

    // 4️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "Job applied successfully",
      data: application,
    });
  } catch (error) {
    
    // 5️⃣ Zod validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    // 6️⃣ Server error
    console.error("Create Application Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
