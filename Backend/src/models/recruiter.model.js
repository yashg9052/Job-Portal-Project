import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		companyName: {
			type: String,
			default: "",
			trim: true,
		},
		companySize: {
			type: String,
			default: "",
		},
		location: {
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
