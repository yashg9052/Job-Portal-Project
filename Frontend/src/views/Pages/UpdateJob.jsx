import React, { useEffect, useState } from "react";
import styles from "../../styles/Update.job.module.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    experience: "",
    location: "",
    applicantRole: "",
    salary: {
      min: "",
      max: "",
      currency: "USD",
      period: "MONTHLY",
    },
    type: "Full-time",
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/auth/browse-jobs/${jobId}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          const job = res.data.job;
          setFormData({
            title: job.title || "",
            description: job.description || "",
            skills: job.skills || [],
            experience: job.experience || "",
            location: job.location || "",
            applicantRole: job.applicantRole || "",
            salary: {
              min: job.salary?.min || "",
              max: job.salary?.max || "",
              currency: job.salary?.currency || "USD",
              period: job.salary?.period || "MONTHLY",
            },
            type: job.type || "Full-time",
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [name]: value,
      },
    }));
    if (errors.salary) {
      setErrors((prev) => ({ ...prev, salary: "" }));
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter" && currentSkill.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(currentSkill.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, currentSkill.trim()],
        }));
        if (errors.skills) {
          setErrors((prev) => ({ ...prev, skills: "" }));
        }
      }
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.title.length < 5 || formData.title.length > 100) {
      newErrors.title = "Title must be between 5 and 100 characters";
    }

    if (
      formData.description.length < 20 ||
      formData.description.length > 5000
    ) {
      newErrors.description =
        "Description must be between 20 and 5000 characters";
    }

    if (formData.skills.length < 1) {
      newErrors.skills = "At least one skill is required";
    }

    if (formData.experience.length < 1 || formData.experience.length > 50) {
      newErrors.experience = "Experience must be between 1 and 50 characters";
    }

    if (formData.location.length < 2 || formData.location.length > 100) {
      newErrors.location = "Location must be between 2 and 100 characters";
    }

    if (
      formData.applicantRole.length < 10 ||
      formData.applicantRole.length > 5000
    ) {
      newErrors.applicantRole =
        "Applicant role must be between 10 and 5000 characters";
    }

    if (!formData.salary.min || formData.salary.min.length < 1) {
      newErrors.salary = "Minimum salary is required";
    }

    if (!formData.salary.max || formData.salary.max.length < 1) {
      newErrors.salary = "Maximum salary is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const value = confirm("Are You Sure You want to Update this job?");
    if (value) {
      try {
        const res = await axios.put(
          `http://localhost:5000/recruiter/update-job/${jobId}`,
          formData,
          { withCredentials: true }
        );

        if (res.status === 200) {
          alert("Job updated succesfully");
          navigate("/recruiter/home/active-jobs");
        }
      } catch (error) {
        console.error("Error updating job:", error);
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading job details...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.formContent}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter job title"
              className={errors.title ? styles.inputError : styles.input}
            />
            {errors.title && (
              <span className={styles.error}>{errors.title}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter job description"
              className={
                errors.description ? styles.textareaError : styles.textarea
              }
              maxLength={5000}
            />
            <div className={styles.charCount}>
              {formData.description.length}/5000
            </div>
            {errors.description && (
              <span className={styles.error}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Skills</label>
            <input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleSkillKeyPress}
              placeholder="Enter required skills..."
              className={errors.skills ? styles.inputError : styles.input}
            />
            <div className={styles.skillsContainer}>
              {formData.skills.map((skill, index) => (
                <span key={index} className={styles.skillTag}>
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className={styles.removeSkill}
                  >
                    ×
                  </button>
                </span>
              ))}
              <span className={styles.skillHint}>
                Add skill and press Enter
              </span>
            </div>
            {errors.skills && (
              <span className={styles.error}>{errors.skills}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Experience Level</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 2-5 years"
                className={errors.experience ? styles.inputError : styles.input}
              />
              {errors.experience && (
                <span className={styles.error}>{errors.experience}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter job location"
                className={errors.location ? styles.inputError : styles.input}
              />
              {errors.location && (
                <span className={styles.error}>{errors.location}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Applicant Role</label>
            <textarea
              name="applicantRole"
              value={formData.applicantRole}
              onChange={handleInputChange}
              placeholder="Describe the role and responsibilities (minimum 10 characters)"
              className={
                errors.applicantRole
                  ? styles.textareaError
                  : styles.textareaSmall
              }
            />
            {errors.applicantRole && (
              <span className={styles.error}>{errors.applicantRole}</span>
            )}
          </div>

          <div className={styles.salarySection}>
            <label className={styles.label}>Salary Range</label>
            <div className={styles.salaryGrid}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="min"
                  value={formData.salary.min}
                  onChange={handleSalaryChange}
                  placeholder="Min salary"
                  className={errors.salary ? styles.inputError : styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="max"
                  value={formData.salary.max}
                  onChange={handleSalaryChange}
                  placeholder="Max salary"
                  className={errors.salary ? styles.inputError : styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <select
                  name="currency"
                  value={formData.salary.currency}
                  onChange={handleSalaryChange}
                  className={styles.select}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="LPA">LPA</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <select
                  name="period"
                  value={formData.salary.period}
                  onChange={handleSalaryChange}
                  className={styles.select}
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>
            {errors.salary && (
              <span className={styles.error}>{errors.salary}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Job Type</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value="Full-time"
                  checked={formData.type === "Full-time"}
                  onChange={handleInputChange}
                  className={styles.radio}
                />
                <span className={styles.radioText}>Full-time</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value="Part-time"
                  checked={formData.type === "Part-time"}
                  onChange={handleInputChange}
                  className={styles.radio}
                />
                <span className={styles.radioText}>Part-time</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value="Remote"
                  checked={formData.type === "Remote"}
                  onChange={handleInputChange}
                  className={styles.radio}
                />
                <span className={styles.radioText}>Remote</span>
              </label>
            </div>
          </div>

          <button onClick={handleSubmit} className={styles.submitButton}>
            Update Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateJob;
