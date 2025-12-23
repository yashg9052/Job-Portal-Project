import { Router } from "express";
import * as recruiterController from "../controllers/recruiter.controller.js";
import { recruiterMiddleware } from "../middlewares/recruiter.middleware.js";

const RecruiterRoute = Router();

RecruiterRoute.route("/dashboard").get(recruiterMiddleware, recruiterController.getRecruiterDashboard);
RecruiterRoute.route("/profile").get(recruiterMiddleware, recruiterController.getRecruiterProfile);
RecruiterRoute.route("/create-job").post(recruiterMiddleware, recruiterController.postCreateJob);
RecruiterRoute.route("/my-jobs").get(recruiterMiddleware, recruiterController.getRecruiterJobs);

export default RecruiterRoute;