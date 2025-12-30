import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
   const user = useSelector((state) => state.user);
   console.log(user)
  
  return (
    <header className="header">
      <div className="header-left">
        <img
          src="/logo_with_name.svg"
          alt="Hunto Logo"
          className="header-logo"
        />
      </div>

      <div className="header-center">
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#888" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="#888" strokeWidth="2" />
          </svg>
          <input type="text" placeholder="Search for company or roles..." />
        </div>
        <button className="filter-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 4h18M6 8h12M9 12h6" stroke="white" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <div className="header-right">
        <div className="notification">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          <span className="notification-badge">1</span>
        </div>
        <div className="user-info">
          <span>Hello {user.name} 👋</span>
          <div className="avatar"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
