import React, { useState, useEffect } from "react";
import "../../styles/JobDetailPage.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/auth/browse-jobs/${id}`,
          { withCredentials: true }
        );
        setJob(res.data.job);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="job-detail-container">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-detail-container">
        <p>Job not found.</p>
      </div>
    );
  }

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    const min = parseInt(salary.min).toLocaleString();
    const max = parseInt(salary.max).toLocaleString();
    const currency = salary.currency || "INR";
    const period = salary.period === "MONTHLY" ? "/month" : "/yr";
    return `${currency} ${min} - ${max}${period}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Posted today";
    if (diffDays === 1) return "Posted 1 day ago";
    return `Posted ${diffDays} days ago`;
  };

  return (
    <div className="job-detail-container">
      {/* Header */}
      <header className="job-detail-header">
        <img
          src="/logo_with_name.svg"
          alt="Hunto Logo"
          className="job-header"
        />
        <div className="job-detail-user-avatar">
          <img src="https://via.placeholder.com/40" alt="User" />
        </div>
      </header>

      {/* Main Job Card */}
      <div className="job-detail-card-main">
        <div className="job-detail-job-header">
          <div className="job-detail-company-info">
            <div className="job-detail-company-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
              </svg>
            </div>
            <div>
              <h2 className="job-detail-job-title">{job.title}</h2>
              <p className="job-detail-company-name">{job.location}</p>
            </div>
          </div>
          <div className="job-detail-salary">{formatSalary(job.salary)}</div>
        </div>
        <div className="job-detail-job-tags">
          <span className="job-detail-tag">{job.location}</span>
          <span className="job-detail-tag">{job.experience}</span>
          <span className="job-detail-tag">{job.status}</span>
          <span className="job-detail-tag job-detail-tag-posted">
            {formatDate(job.createdAt)}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="job-detail-content-grid">
        {/* Left Column */}
        <div className="job-detail-left-column">
          {/* Job Description */}
          <div className="job-detail-section">
            <h3 className="job-detail-section-title">
              <svg
                className="job-detail-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Job Description
            </h3>
            <p className="job-detail-description-text">{job.description}</p>
          </div>

          {/* Your Role */}
          <div className="job-detail-section">
            <h3 className="job-detail-section-title">
              <svg
                className="job-detail-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Role
            </h3>
            <p className="job-detail-description-text">
              Your role is a first mattorm a neesident opportunity, lov
              designer, hed xing professionmont right and process-
              Intricgraphic, conexany and somalizations. Marketing rucblsi
              araphic designs. Sholeys help time to develops thennature as
              amennic designers strewning, and orotinxraphic developning and
              skill anostaneatrooted dessanor. About backgartendts retalows,
              maturements and snowrsolving compositive sanoctors.
            </p>
          </div>

          {/* Similar Jobs */}
          <div className="job-detail-section">
            <h3 className="job-detail-similar-jobs-title">Similar Jobs</h3>
            <div className="job-detail-similar-jobs-grid">
              {[1, 2, 3].map((item) => (
                <div key={item} className="job-detail-similar-job-card">
                  <h4 className="job-detail-similar-job-title">{job.title}</h4>
                  <p className="job-detail-company-name">{job.location}</p>
                  <div className="job-detail-job-tags job-detail-job-tags-similar">
                    <span className="job-detail-tag job-detail-tag-small">
                      {job.status}
                    </span>
                    <span className="job-detail-tag job-detail-tag-small">
                      {job.experience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="job-detail-right-column">
          {/* Skills & Requirements */}
          <div className="job-detail-section job-detail-skills-section">
            <h3 className="job-detail-section-title">
              <svg
                className="job-detail-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Skills & Requirements
            </h3>
            <ul className="job-detail-skills-list">
              {job.skills && job.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <li key={index} className="job-detail-skills-list-item">
                    {skill}
                  </li>
                ))
              ) : (
                <li className="job-detail-skills-list-item">
                  No specific skills listed
                </li>
              )}
            </ul>
          </div>

          {/* About Spotify */}
          <div className="job-detail-section job-detail-about-section">
            <h3 className="job-detail-section-title">About Spotify</h3>
            <p className="job-detail-about-text">
              Spotify is an uniquid massikale forbthond shortown product, and
              information. Spotify...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="job-detail-action-buttons">
            <button className="job-detail-btn-save">Save</button>
            <button className="job-detail-btn-apply">
              Apply Now
              <svg
                className="job-detail-arrow-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
