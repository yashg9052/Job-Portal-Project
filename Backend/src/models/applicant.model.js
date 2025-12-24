
import mongoose from "mongoose";

export const applicant_schema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    resume_url: {
      type: String,
      default: "",
    },
    deleted:{
        type:Boolean,
        default:false,
        deletedAt:{type:Date,default:null}
    }
  },
  { timestamps: true }
);
export const Applicant_model = mongoose.model("Applicant", applicant_schema);