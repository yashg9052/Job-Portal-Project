import { Router } from "express";
import * as recruiterController from "../controllers/recruiter.controller.js";
import { recruiterMiddleware } from "../middlewares/recruiter.middleware.js";

const RecruiterRoute = Router();

RecruiterRoute.route("/dashboard").get(
  recruiterMiddleware,
  recruiterController.getRecruiterDashboard
);
RecruiterRoute.route("/profile").get(
  recruiterMiddleware,
  recruiterController.getRecruiterProfile
);
RecruiterRoute.route("/create-job").post(
  recruiterMiddleware,
  recruiterController.postCreateJob
);
RecruiterRoute.route("/active-jobs").get(
  recruiterMiddleware,
  recruiterController.getActiveJobs
);

RecruiterRoute.route("/closed-jobs").get(
  recruiterMiddleware,
  recruiterController.getClosedJobs
);
RecruiterRoute.route("/update-job/:jobId").put(
  recruiterMiddleware,
  recruiterController.putUpdateJob
);
RecruiterRoute.route("/delete-job/:jobId").put(
  recruiterMiddleware,
  recruiterController.deleteJob
);
export default RecruiterRoute;
