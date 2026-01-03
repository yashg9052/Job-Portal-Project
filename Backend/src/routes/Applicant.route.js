import { Router } from "express";
import { applicantMiddleware } from "../middlewares/applicant.middleware.js";
import * as applicantController from "../controllers/applicant.controller.js";
import multer from "multer";
import { upload } from "../storage/storage.services.js";
const ApplicantRoute = Router();
ApplicantRoute.route("/profile").get(
  applicantMiddleware,
  applicantController.getProfile
);

ApplicantRoute.route("/update-profile").put(
  applicantMiddleware,
  applicantController.updateProfile
);
ApplicantRoute.route("/browse-jobs")
  .get(applicantMiddleware, applicantController.getbrowseJobs)
  .post(applicantMiddleware,applicantController.postbrowseJobs);
ApplicantRoute.route("/browse-jobs/filter").get(
  applicantMiddleware,
  applicantController.browseJobsFilter
);

ApplicantRoute.route("/job/application/:jobId").post(
  applicantMiddleware,
  upload.single("resume"),
  applicantController.applyForJob
);
ApplicantRoute.route("/savejob/:jobId").get(applicantMiddleware,applicantController.checkJobSavedStatus).post(
  applicantMiddleware,
  applicantController.saveJobForUser
);
// ApplicantRoute.route("/get-savedjobs").post(
//   applicantMiddleware,
//   applicantController.getSavedJobs
// );
// ApplicantRoute.route("/get-appliedjobs").post(
//   applicantMiddleware,
//   applicantController.getSavedJobs
// );

export default ApplicantRoute;
