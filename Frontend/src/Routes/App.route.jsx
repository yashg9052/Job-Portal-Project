import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { UserRegisterPage } from "../views/Pages/User.Register";
import { GetStartedpage } from "../views/Pages/GetStartedPage";
import { UserLoginPage } from "../views/Pages/User.Login";
import HomePage from "../views/Pages/HomePage";
import JobDetails from "../views/Pages/JobDetailPage";
import { JobApplicationPage } from "../views/Pages/JobApplicationPage";
import HomeLayout from "../views/Pages/HomeLayout";
import RecruiterHomeLayout from "../views/Pages/RecruiterHomeLayout";
import RecruiterHomepage from "../views/Pages/Recruiter.Homepage";
import CreateJob from "../views/Pages/CreateJobs";
import ActiveJobsPage from "../views/Pages/ActiveJobs";
import UpdateJob from "../views/Pages/UpdateJob";
export const Approutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStartedpage />} />

        <Route path="/home" element={<HomeLayout />}>
          <Route index element={<HomePage />} />

          <Route path="jobs/:jobId" element={<JobDetails />} />
          <Route
            path="jobs/application/:jobId"
            element={<JobApplicationPage />}
          />
        </Route>
        <Route path="/recruiter/home" element={<RecruiterHomeLayout />}>
          <Route index element={<RecruiterHomepage />} />
          <Route path="createJob" element={<CreateJob />} />
          <Route path="active-jobs" element={<ActiveJobsPage />} />
          <Route path="update-job/:jobId" element={<UpdateJob />} />
        </Route>

        <Route path="/user/register" element={<UserRegisterPage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
      </Routes>
    </Router>
  );
};
