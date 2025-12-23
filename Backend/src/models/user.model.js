import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
    type: String,
    required: function () {
    return this.provider === "local";
  }
  },
  role: {
    type: String,
    enum: ["applicant", "recruiter", "admin"],
    default: "applicant",
    required: true,
  },
  provider:{
    type: String,
    enum: ["local", "google"],
    required: true,
  },
 
  
}, { timestamps: true });   

export const User_model = mongoose.model("User", userSchema);