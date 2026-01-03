import React, { useState, useEffect } from "react";
import styles from "../../styles/Recruiter.HomePage.module.css";
import { useNavigate } from "react-router-dom";

const RecruiterHomepage = () => {
  const [recruiterData, setRecruiterData] = useState({
    name: "Innovate Tech",
    email: "contact@innovatetech.com",
    location: "San Francisco, CA",
    accountCreatedOn: "Jan 15, 2023",
    totalJobs: 120,
    openJobs: 45,
    closedJobs: 75,
  });
  const navigate = useNavigate();

  const [recentActivities] = useState([
    {
      id: 1,
      action: "New application received",
      job: "Senior Developer",
      time: "2 hours ago",
    },
    { id: 2, action: "Job posted", job: "UX Designer", time: "5 hours ago" },
    {
      id: 3,
      action: "Interview scheduled",
      job: "Product Manager",
      time: "1 day ago",
    },
  ]);

  // Simulating API call - replace with your actual backend call
  useEffect(() => {
    // fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    try {
      // const response = await fetch('/api/recruiter');
      // const data = await response.json();
      // setRecruiterData(data);
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    }
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleCreateJob = () => {
    navigate("createjob");
  };

  const handleActiveJobs = () => {
    navigate("active-jobs");
  };

  return (
    <div className={`${styles.dashboardContainer}`}>
      <div>
        <div className={`${styles.profileCard}`}>
          <div className={`${styles.avatar}`}></div>

          <h1 className={`${styles.companyName}`}>{recruiterData.name}</h1>

          <div className={`${styles.infoSection}`}>
            <p className={`${styles.infoText}`}>
              <span className={`${styles.infoLabel}`}>Email:</span>{" "}
              {recruiterData.email}
            </p>
            <p className={`${styles.infoText}`}>
              <span className={`${styles.infoLabel}`}>Location:</span>{" "}
              {recruiterData.location}
            </p>
            <p className={`${styles.infoText}`}>
              <span className={`${styles.infoLabel}`}>Account created on:</span>{" "}
              {recruiterData.accountCreatedOn}
            </p>
          </div>

          <button
            className={`${styles.editProfileBtn}`}
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>

          <div className={`${styles.statsGrid}`}>
            <div className={`${styles.statCard} ${styles.statCardPurple}`}>
              <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className={`${styles.statContent}`}>
                <p className={`${styles.statLabel}`}>Total Jobs</p>
                <p className={`${styles.statValue}`}>
                  {recruiterData.totalJobs}
                </p>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCardGreen}`}>
              <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className={`${styles.statContent}`}>
                <p className={`${styles.statLabel}`}>Open Jobs</p>
                <p className={`${styles.statValue}`}>
                  {recruiterData.openJobs}
                </p>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statCardRed}`}>
              <div className={`${styles.statIcon} ${styles.statIconRed}`}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <div className={`${styles.statContent}`}>
                <p className={`${styles.statLabel}`}>Closed Jobs</p>
                <p className={`${styles.statValue}`}>
                  {recruiterData.closedJobs}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.sidebar}`}>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnPurple}`}
          onClick={handleCreateJob}
        >
          <div className={`${styles.actionIcon} `}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <span>Create Job</span>
        </button>

        <button
          className={`${styles.actionBtn} ${styles.actionBtnGreen}`}
          onClick={handleActiveJobs}
        >
          <div className={`${styles.actionIcon} `}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span>Active Jobs</span>
        </button>

        {/* Recent Activity Box */}
        <div className={`${styles.recentActivityBox}`}>
          <h3 className={`${styles.activityTitle}`}>Recent Activity</h3>
          <div className={`${styles.activityList}`}>
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`${styles.activityItem}`}>
                <div className={`${styles.activityDot}`}></div>
                <div className={`${styles.activityContent}`}>
                  <p className={`${styles.activityAction}`}>
                    {activity.action}
                  </p>
                  <p className={`${styles.activityJob}`}>{activity.job}</p>
                  <p className={`${styles.activityTime}`}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterHomepage;
