import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "rejected", "hired"],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },
    recruiterId:{
        type: mongoose.Schema.Types.ObjectId,
      ref: "recruiter",
      required: true,
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicant",
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },
     resumePublicId: { 
    type: String, 
    required: true 
  },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "rejected", "hired"],
      default: "applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const application_model= mongoose.model("Applications", applicationSchema);
