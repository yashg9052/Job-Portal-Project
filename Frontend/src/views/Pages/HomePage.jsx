import React, { useEffect, useState } from "react";
import styles from "../../styles/HomePage.module.css";
import Sidebar from "../../components/Sidebar";
import JobCard from "../../components/JobCard";
import axios from "axios";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Discover");
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async (tab) => {
    try {
      const url =
        tab === "Discover"
          ? "http://localhost:5000/applicant/browse-jobs"
          : "http://localhost:5000/applicant/browse-jobs";

      const res =
        tab === "Discover"
          ? await axios.get(url, { withCredentials: true })
          : await axios.post(url, { tab }, { withCredentials: true });

      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs("Discover");
  }, []);

  const handleTab = (tab) => {
    setActiveTab(tab);
    fetchJobs(tab);
  };

  const tabs = ["Discover", "Saved", "Applied", "Closed"];

  return (
    <div className={styles.app}>
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.contentArea}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.tab} ${
                  activeTab === tab ? styles.active : ""
                }`}
                onClick={() => handleTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.jobsGrid}>
            {jobs.map((job) => (
              
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
