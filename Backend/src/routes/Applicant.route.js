import { Router } from "express";
import { applicantMiddleware } from "../middlewares/applicant.middleware.js";
import * as applicantController from "../controllers/applicant.controller.js";

const ApplicantRoute = Router();
ApplicantRoute.route("/profile").get(applicantMiddleware, applicantController.getProfile);
ApplicantRoute.route("/update-profile").put(applicantMiddleware, applicantController.updateProfile);
ApplicantRoute.route("/browse-jobs").get(applicantMiddleware, applicantController.browseJobs);
ApplicantRoute.route("/browse-jobs/filter").get(applicantMiddleware, applicantController.browseJobsFilter);

ApplicantRoute.route("/job/application/:userId/:jobId").post(applicantMiddleware, applicantController.applyForJob);



export default ApplicantRoute;