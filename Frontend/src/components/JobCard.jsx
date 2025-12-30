import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const {
    _id,
    title,
    recruiter: company,
    createdAt,
    experience,
    description,
    location,
    salary,
  } = job;
  const navigate = useNavigate();

  const color = "orange-card";
  const logo = "♫";
  const logoColor = "#1DB954";
  const type = "Fulltime";

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/jobs/${_id}`)
  };
  const getTimeAgo = (date) => {
    const now = new Date();
    const postedDate = new Date(date);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not disclosed";

    const { min, max, currency, period } = salary;
    const formatter = new Intl.NumberFormat("en-IN");

    return `₹${formatter.format(min)} - ₹${formatter.format(
      max
    )} / ${period.toLowerCase()}`;
  };

  return (
    <div className={`job-card ${color}`} onClick={handleView}>
      <div className="job-card-header">
        <div className="company-logo" style={{ backgroundColor: logoColor }}>
          {logo}
        </div>

        <div className="job-title-section">
          <div className="small-title-section">
            <h3>{title}</h3>
            <button className="small-view-btn" onClick={ handleView}>
              View ↗
            </button>
          </div>

          <p className="company-name">{company}</p>
        </div>

        <button className="view-btn" onClick={ handleView}>View ↗</button>
      </div>

      <div className="job-tags">
        <span className="tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>{" "}
          {location}
        </span>

        <span className="tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>{" "}
          {experience}
        </span>

        <span className="tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 1v6M12 17v6M23 12h-6M7 12H1"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>{" "}
          {type}
        </span>
      </div>

      <p className="job-description">{description}</p>

      <div className="job-footer">
        <div className="posted-time">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
          </svg>
          Posted {getTimeAgo(createdAt)}
        </div>

        <div className="salary">{formatSalary(salary)}</div>
      </div>
    </div>
  );
};

export default JobCard;
