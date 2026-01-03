import { Applicant_model } from "../models/applicant.model.js";
import { application_model } from "../models/job.applications.model.js";
import { Job_model } from "../models/job.model.js";
import { v2 as cloudinary } from "cloudinary";

import streamifier from "streamifier";
import { Recruiter_model } from "../models/recruiter.model.js";
// import { applicationSchema } from "../validators/application.validator.js";

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
export const getbrowseJobs = async (req, res) => {
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
export const postbrowseJobs = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { tab } = req.body;

    const applicant = await Applicant_model.findOne({
      user_id: req.user._id,
    }).select("_id savedJobs");

    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const getJobIdsByTab = async (tab) => {
      switch (tab) {
        case "Saved":
          return applicant.savedJobs;

        case "Applied": {
          const applications = await application_model
            .find({ applicantId: applicant._id })
            .select("jobId");
          return applications.map((app) => app.jobId);
        }

        case "Closed": {
          const closedJobs = await Job_model.find({ status: "CLOSED" }).select(
            "_id"
          );
          return closedJobs.map((job) => job._id);
        }

        default:
          return null;
      }
    };

    const jobIds = await getJobIdsByTab(tab);

    if (!jobIds) {
      return res.status(400).json({ error: "Invalid tab" });
    }

    const jobs = await Job_model.find({ _id: { $in: jobIds } });

    res.status(200).json({ jobs });
  } catch (err) {
    console.error("Get jobs error:", err);
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

// export const applyForJob = async (req, res) => {
//   if (!req.user || req.user.role !== "applicant") {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   try {
//     // 1️⃣ Validate request body using Zod
//     const { jobId } = req.params;

//     // const resumeUrl = applicationSchema.parse(req.file.buffer);
//     const applicantId=await Applicant_model.findOne({user_id:req.user["_id"]}).select("_id");
//     const recruiterId=await Job_model.findOne({_id:jobId}).select("recruiter")
//     // 2️⃣ Prevent duplicate application (optional but recommended)
//     const existingApplication = await application_model.findOne({
//       jobId: jobId,
//       applicantId: applicantId._id,

//     });

//     if (existingApplication) {
//       return res.status(409).json({
//         success: false,
//         message: "You have already applied for this job",
//       });
//     }

//     // 3️⃣ Create application
//     const application = await application_model.create({
//       ...validatedData,
//       jobId: jobId,
//       applicantId: applicantId._id,
//       recruiterId:recruiterId._id,
//       status: "applied",
//       statusHistory: [
//         {
//           status: "applied",
//         },
//       ],
//     });

//     // 4️⃣ Success response
//     return res.status(201).json({
//       success: true,
//       message: "Job applied successfully",
//       data: application,
//     });
//   } catch (error) {

//     // 5️⃣ Zod validation error
//     if (error.name === "ZodError") {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: error.errors,
//       });
//     }

//     // 6️⃣ Server error
//     console.error("Create Application Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
export const applyForJob = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { jobId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const applicantId = await Applicant_model.findOne({
      user_id: req.user["_id"],
    }).select("_id");

    if (!applicantId) {
      return res.status(404).json({
        success: false,
        message: "Applicant profile not found",
      });
    }

    const job = await Job_model.findOne({ _id: jobId }).select("recruiter");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // 3️⃣ Prevent duplicate application
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

    // 4️⃣ Upload resume to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
            public_id: `resume_${applicantId._id}_${Date.now()}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const cloudinaryResult = await uploadToCloudinary();

    // 5️⃣ Create application with resume URL
    const application = await application_model.create({
      jobId: jobId,
      applicantId: applicantId._id,
      recruiterId: job.recruiter,
      resumeUrl: cloudinaryResult.secure_url,
      resumePublicId: cloudinaryResult.public_id,
      status: "applied",
      statusHistory: [
        {
          status: "applied",
        },
      ],
    });

    // 6️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "Job applied successfully",
      data: application,
    });
  } catch (error) {
    // 7️⃣ Cloudinary upload error
    if (error.http_code) {
      return res.status(500).json({
        success: false,
        message: "Resume upload failed",
        error: error.message,
      });
    }

    // 8️⃣ Server error
    console.error("Create Application Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Toggle save/unsave job
export const saveJobForUser = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const userId = req.user._id;
    const { jobId } = req.params;
    const { saved } = req.body;

    const job = await Job_model.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // If saved is true, it means job is currently saved, so we need to unsave it
    // If saved is false, it means job is not saved, so we need to save it
    const updateQuery = saved
      ? { $pull: { savedJobs: jobId } } // unsave (remove from array)
      : { $addToSet: { savedJobs: jobId } }; // save (add to array)

    const user = await Applicant_model.findOneAndUpdate(
      { user_id: userId },
      updateQuery,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: saved ? "Job removed from saved list" : "Job saved successfully",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    console.error("Toggle Save Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Check if job is saved by user
export const checkJobSavedStatus = async (req, res) => {
  if (!req.user || req.user.role !== "applicant") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    const job = await Job_model.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const applicant = await Applicant_model.findOne({ user_id: userId }).select("savedJobs");
    
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant profile not found",
      });
    }

    const isSaved = applicant.savedJobs.includes(jobId);

    return res.status(200).json({
      success: true,
      isSaved: isSaved,
    });
  } catch (error) {
    console.error("Check Saved Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};