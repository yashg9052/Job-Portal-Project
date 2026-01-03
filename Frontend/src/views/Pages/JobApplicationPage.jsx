import React, { useState, useEffect } from "react";
import styles from "../../styles/JobApplication.module.css";
import { useParams } from "react-router-dom";
import Header from "../partials/Header";
import axios from "axios";

export const JobApplicationPage = () => {
  const [jobData, setJobData] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const { jobId } = useParams();

  // Fetch job data from API
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/auth/browse-jobs/${jobId}`,
          { credentials: "include" }
        );

        const result = await response.json();
        const job = result.job;

        // 🔹 Map backend response → UI format
        const mappedJobData = {
          title: job.title,
          location: job.location,
          salary: `${job.salary.currency}${job.salary.min} - ${
            job.salary.max
          }/${job.salary.period.toLowerCase()}`,
          tags: [job.location, job.experience, job.status],
          description: job.description,
          role: job.applicantRole,
          skills: job.skills,
          color:job.color,
        };

        setJobData(mappedJobData);
      } catch (error) {
        console.error("Failed to fetch job data", error);
      }
    };

    fetchJobData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setResumeUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResumeFile(file);
      setResumeUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      alert("Please upload your resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile); // 👈 must match backend: upload.single("resume")

    try {
      const res = await axios.post(
        `http://localhost:5000/applicant/job/application/${jobId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert("Application submitted successfully!");
        setResumeFile(null);
        setResumeUrl("");
      } else {
        alert("Unable to submit application");
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      if (status === 409) {
        alert(message); // "You have already applied for this job"
      } else {
        console.error(error);
        alert("Upload failed");
      }
    }
  };

  if (!jobData) {
    return <div className={styles.body}>Loading...</div>;
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.headerCard} style={{backgroundColor:jobData.color}}>
          <div className={styles.title}>
            <div className={styles.icon}>👨‍💼</div>
            <span>{jobData.title}</span>
          </div>
          <div className={styles.location}>{jobData.location}</div>
          <div className={styles.tags}>
            {jobData.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.salary}>{jobData.salary}</div>
        </div>

        <div className={styles.leftSection}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>📋 Job Description</div>
            <div className={styles.cardContent}>{jobData.description}</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>👤 Your Role</div>
            <div className={styles.cardContent}>{jobData.role}</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>✅ Skills & Requirements</div>
            <div className={styles.cardContent}>
              <ul>
                {jobData.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.applyCard}>
          <div className={styles.applyTitle}>Apply Now</div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Upload Resume (PDF/DOCX)</label>
              <div
                className={`${styles.uploadBtn} ${
                  isDragging ? styles.dragging : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {resumeFile
                  ? `✓ ${resumeFile.name}`
                  : "📎 Choose File or Drop Here"}
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Resume URL</label>
              <input
                type="text"
                className={styles.input}
                value={resumeUrl}
                placeholder="Resume URL will appear here"
                readOnly
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
