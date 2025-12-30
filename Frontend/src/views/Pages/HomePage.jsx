import React, { useEffect, useState } from "react";
import "../../styles/Home.css";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Sidebar from "../../components/Sidebar";
import JobCard from "../../components/JobCard";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setJobs} from "../../features/slices";


const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Discover");
  const dispatch = useDispatch();
  
  const jobs = useSelector((state) => state.jobs);
  const user=useSelector((state) => state.user);
  
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/applicant/browse-jobs",
          {
            withCredentials: true,
          }
        );

        dispatch(setJobs(res.data.jobs)); // 👈 store update
      } catch (error) {
        console.error(error);
      }
    };

    loadJobs();
  }, []);
  

  
  const tabs = ["Discover", "Saved", "Applied", "Closed", "Discarded"];

  return (
    <div className="app">
      <Header  />

      <div className="main-content">
        <Sidebar />

        <div className="content-area">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="jobs-grid">
            {jobs.map((job, index) => {
              
              return (<JobCard key={index} job={job} />);
            })}
          </div>

          {/* <div className="pagination">
            <button className="page-btn">‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">›</button>
          </div> */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
