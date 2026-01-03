import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/HomePage.module.css";

const JobCard = ({ job} ) => {
  
  const {
    _id,
    title,
    recruiter,
    createdAt,
    experience,
    description,
    location,
    salary,
    type,
    color,
    logo
    
  } = job;
 
  const navigate = useNavigate();
  
  const logoColor = "#1DB954";

  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/home/jobs/${_id}`);
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
  
  // Handle LPA (Lakhs Per Annum) format
  if (currency === "LPA") {
    return `₹${min} - ₹${max} ${currency}`;
  }
  
  // Handle regular INR format with thousand separators
  const formatter = new Intl.NumberFormat("en-IN");
  return `₹${formatter.format(min)} - ₹${formatter.format(max)} / ${period.toLowerCase()}`;
};
  return (
    <div className={`${styles.jobCard} `} style={{backgroundColor:color?color:"rgb(98 66 255)"}}onClick={handleView}>
      <div className={`${styles.jobCardHeader}`}>
        <div
          className={`${styles.companyLogo}`}
          style={{ backgroundColor: logoColor }}
        >
          {logo?logo:"."}
        </div>
        <div className={`${styles.jobTitleSection}`}>
          <div className={`${styles.smallTitleSection}`}>
            <h3>{title}</h3>
            <button className={`${styles.smallViewBtn}`} onClick={handleView}>
              View ↗
            </button>
          </div>
          <p className={`${styles.companyName}`}>{recruiter}</p>
        </div>
        <button className={`${styles.viewBtn}`} onClick={handleView}>
          View ↗
        </button>
      </div>
      <div className={`${styles.jobTags}`}>
        <span className={`${styles.tag}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>{" "}
          {location}
        </span>
        <span className={`${styles.tag}`}>
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
        <span className={`${styles.tag}`}>
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
      <p className={`${styles.jobDescription}`}>{description}</p>
      <div className={`${styles.jobFooter}`}>
        <div className={`${styles.postedTime}`}>
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
        <div className={`${styles.salary}`}>{formatSalary(salary)}</div>
      </div>
    </div>
  );
};

export default JobCard;
