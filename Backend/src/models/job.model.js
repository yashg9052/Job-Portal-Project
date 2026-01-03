import mongoose from "mongoose";
import { string } from "zod";

const job_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    applicantRole: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
    },
    
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote"],
      default: "Full-time",
    },
    logo: {
      type: String,
      trim: true,
      default:"",
    },
    salary: {
      min: { type: String, required: true },
      max: { type: String, required: true },
      currency: { type: String, required: true, default: "INR " },
      period: { type: String, enum: ["MONTHLY", "YEARLY"], default: "MONTHLY" },
    },
    recruiter: {
      type: String,
      required:true,
      
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },

    deleted: {
      type: Boolean,
      default: false,
      deletedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

export const Job_model = mongoose.model("Job", job_schema);
