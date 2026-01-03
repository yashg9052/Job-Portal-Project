import React, { useState, useEffect } from "react";
import styles from "../../styles/JobDetailPage.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const user = JSON.parse(localStorage.getItem("User"));

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Fetch job details
        const jobRes = await axios.get(
          `http://localhost:5000/auth/browse-jobs/${jobId}`,
          { withCredentials: true }
        );
        setJob(jobRes.data.job);

        // Fetch saved status
        const savedRes = await axios.get(
          `http://localhost:5000/applicant/savejob/${jobId}`,
          { withCredentials: true }
        );
        
        if (savedRes.data.success) {
          setSaved(savedRes.data.isSaved);
        }
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={styles.container}>
        <p>Job not found.</p>
      </div>
    );
  }

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    const { min, max, currency, period } = salary;
    
    // Handle LPA (Lakhs Per Annum) format
    if (currency === "LPA") {
      return `₹${min} - ₹${max} ${currency}`;
    }
    
    // Handle regular INR format
    const minFormatted = parseInt(min).toLocaleString();
    const maxFormatted = parseInt(max).toLocaleString();
    const periodText = period === "MONTHLY" ? "/month" : "/yr";
    return `${currency} ${minFormatted} - ${maxFormatted}${periodText}`;
  };

  const handleApplyNow = () => {
    navigate(`/home/jobs/application/${job._id}`);
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
  
  const handleSave = async () => {
    try {
      // Send request to toggle save status
      const res = await axios.post(
        `http://localhost:5000/applicant/savejob/${jobId}`,
        { saved: saved }, // Send current saved state
        { withCredentials: true }
      );
      
      if (res.data.success) {
        // Toggle the saved state
        setSaved(!saved);
        alert(`Job ${!saved ? "saved" : "unsaved"} successfully!`);
      } else {
        alert(`Unable to ${!saved ? "save" : "unsave"} job`);
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      alert("Failed to update save status. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Main Job Card */}
      <div className={styles.cardMain} style={{backgroundColor:`${job.color?job.color:"rgb(98 66 255)"}`}}>
        <div className={styles.jobHeader}>
          <div className={styles.companyInfo}>
            <div className={styles.companyLogo}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
              </svg>
            </div>
            <div>
              <h2 className={styles.jobTitle}>{job.title}</h2>
              <p className={styles.companyName}>{job.location}</p>
            </div>
          </div>
          <div className={styles.salary}>{formatSalary(job.salary)}</div>
        </div>
        <div className={styles.jobTags}>
          <span className={styles.tag}>{job.location}</span>
          <span className={styles.tag}>{job.experience}</span>
          <span className={styles.tag}>{job.status}</span>
          <span className={`${styles.tag} ${styles.tagPosted}`}>
            {formatDate(job.createdAt)}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.contentGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Job Description */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Job Description
            </h3>
            <p className={styles.descriptionText}>{job.description}</p>
          </div>

          {/* Your Role */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Your Role
            </h3>
            <p className={styles.descriptionText}>{job.applicantRole}</p>
          </div>

          {/* Similar Jobs */}
          <div className={styles.section}>
            <h3 className={styles.similarJobsTitle}>Similar Jobs</h3>
            <div className={styles.similarJobsGrid}>
              {[1, 2, 3].map((item) => (
                <div key={item} className={styles.similarJobCard}>
                  <h4 className={styles.similarJobTitle}>{job.title}</h4>
                  <p className={styles.companyName}>{job.location}</p>
                  <div className={`${styles.jobTags} ${styles.jobTagsSimilar}`}>
                    <span className={`${styles.tag} ${styles.tagSmall}`}>
                      {job.status}
                    </span>
                    <span className={`${styles.tag} ${styles.tagSmall}`}>
                      {job.experience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Skills & Requirements */}
          <div className={`${styles.section} ${styles.skillsSection}`}>
            <h3 className={styles.sectionTitle}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Skills & Requirements
            </h3>
            <ul className={styles.skillsList}>
              {job.skills && job.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <li key={index} className={styles.skillsListItem}>
                    {skill}
                  </li>
                ))
              ) : (
                <li className={styles.skillsListItem}>
                  No specific skills listed
                </li>
              )}
            </ul>
          </div>

          {/* About Spotify */}
          <div className={`${styles.section} ${styles.aboutSection}`}>
            <h3 className={styles.sectionTitle}>About Spotify</h3>
            <p className={styles.aboutText}>
              Spotify is an uniquid massikale forbthond shortown product, and
              information. Spotify...
            </p>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.btnSave} onClick={handleSave}>
              {saved ? "Saved" : "Save"}
            </button>
            <button className={styles.btnApply} onClick={handleApplyNow}>
              Apply Now
              <svg
                className={styles.arrowIcon}
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