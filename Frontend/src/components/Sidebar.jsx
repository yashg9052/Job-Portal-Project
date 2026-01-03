import { useState } from "react";
import styles from "../styles/HomePage.module.css";

const Sidebar = () => {
  const [selectedLocation, setSelectedLocation] = useState("New York");
  const [selectedExperience, setSelectedExperience] = useState("Remote");

  return (
    <aside className={`${styles.sidebar}`}>
      <h2>Filters</h2>

      <div className={`${styles.filterSection}`}>
        <h3>Location</h3>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option>New York</option>
          <option>Sydney</option>
          <option>Remote</option>
        </select>
      </div>

      <div className={`${styles.filterSection}`}>
        <h3>Experience</h3>
        <select
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
        >
          <option>Remote</option>
          <option>3 years exp.</option>
          <option>1-5 years exp.</option>
        </select>
      </div>

      <div className={`${styles.filterSection}`}>
        <h3>Job Type</h3>
        <label className={`${styles.checkboxLabel}`}>
          <input type="checkbox" />
          <span>Remote</span>
        </label>
        <label className={`${styles.checkboxLabel}`}>
          <input type="checkbox" />
          <span>Enxeroyens</span>
        </label>
      </div>

      <div className={`${styles.filterSection}`}>
        <h3>Salary Range</h3>
        <p className={`${styles.salaryRange}`}>$112,000 - $350K</p>
        <input type="range" min="0" max="350000" className={`${styles.slider}`} />
      </div>
    </aside>
  );
};

export default Sidebar;