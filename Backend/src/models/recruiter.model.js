import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
	email:{
		type:String,
		required:true,
	},
    color: {
      type: String,
      required: true,
    },
    logo: {           /*take from profile*/
      type: String,
      trim: true,
	  default:""
    },
    // logocolor: {
    //   type: String,
    // },
    
    location: {   /*take from profile*/
      type: String,
      default: "",
    },  
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Recruiter_model = mongoose.model("Recruiter", recruiterSchema);
