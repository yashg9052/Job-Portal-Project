import React, { useState, useEffect } from "react";
import styles from "../../styles/ActiveJobsPage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ActiveJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [applicants, setapplicants] = useState({});
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/recruiter/active-jobs",
          { withCredentials: true }
        );

        setJobs(res.data.openJobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobs]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSalary = (salary) => {
    const { min, max, currency, period } = salary;

    // Format currency symbol
    let currencySymbol = "";
    switch (currency) {
      case "USD":
        currencySymbol = "$";
        break;
      case "INR":
        currencySymbol = "₹";
        break;
      case "LPA":
        currencySymbol = "₹";
        break;
      default:
        currencySymbol = currency;
    }

    // Format period
    let periodText = "";
    switch (period) {
      case "MONTHLY":
        periodText = "/month";
        break;
      case "YEARLY":
        periodText = "/year";
        break;
      default:
        periodText = `/${period.toLowerCase()}`;
    }

    // For LPA (Lakhs Per Annum), show it differently
    if (currency === "LPA") {
      return `${min} - ${max} LPA`;
    }

    return `${currencySymbol}${min} - ${currencySymbol}${max} ${periodText}`;
  };

  const handleUpdate = (jobId) => {
    navigate(`/recruiter/home/update-job/${jobId}`);
  };

  const handleClose = async (jobId) => {
    const value = confirm("Are You Sure You want to Close this job?");
    if (value) {
      const res = await axios.patch(
        `http://localhost:5000/recruiter/close-job/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("job closed successfully");
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      }
    }
  };

  const handleDelete = async (jobId) => {
    const value = confirm("Are You Sure You want to Delete this job?");
    if (value) {
      const res = await axios.patch(
        `http://localhost:5000/recruiter/delete-job/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("job deleted successfully");
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      }
    }
  };

  const handleViewApplicants = (jobId) => {
    console.log("View applicants for job:", jobId);
    // Add your view applicants logic here
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.jobsList}>
        {jobs.map((job) => (
          <div key={job._id} className={styles.jobCard}>
            <div className={styles.jobHeader}>
              <h2 className={styles.jobTitle}>{job.title}</h2>
              <span className={styles.jobType}>{job.type}</span>
            </div>

            <div className={styles.jobDetails}>
              <div className={styles.detailItem}>
                <span className={styles.icon}>💰</span>
                <span className={styles.label}>Salary:</span>
                <span className={styles.value}>{formatSalary(job.salary)}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.icon}>⚙️</span>
                <span className={styles.label}>Experience:</span>
                <span className={styles.value}>{job.experience}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.icon}>📍</span>
                <span className={styles.label}>Location:</span>
                <span className={styles.value}>{job.location}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.icon}>📅</span>
                <span className={styles.label}>Posted on:</span>
                <span className={styles.value}>
                  {formatDate(job.createdAt)}
                </span>
              </div>
            </div>

            <div className={styles.jobActions}>
              <button
                className={styles.viewApplicantsBtn}
                onClick={() => handleViewApplicants(job._id)}
              >
                <span className={styles.applicantsIcon}>⚙️</span>
                Applicants: {job.applicantCount || 0}
              </button>

              <div className={styles.actionButtons}>
                <button
                  className={styles.updateBtn}
                  onClick={() => handleUpdate(job._id)}
                >
                  Update
                </button>
                <button
                  className={styles.closeBtn}
                  onClick={() => handleClose(job._id)}
                >
                  Close
                </button>
              </div>

              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(job._id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveJobsPage;
