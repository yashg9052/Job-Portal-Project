import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

const companies = [
  { name: "Airbnb", color: "#ff6b6b", logo: "🅰️" },
  { name: "Meta", color: "#2b6cb0", logo: "Ⓜ️" },
  { name: "Microsoft", color: "#444", logo: "▦" },
  { name: "Goldman Sachs", color: "#333", logo: "GS" },
  { name: "Tesla", color: "#d23", logo: "⚡" },
  { name: "Apple", color: "#111", textColor: "#fff", logo: "" },
  { name: "Swiggy", color: "#ff9f1c", logo: "S" },
  { name: "Uber", color: "#3d3d3d", logo: "U" },
  { name: "Google", color: "#2f2f2f", logo: "G" },
  { name: "LinkedIn", color: "#1e6fbf", logo: "in" },
  { name: "Amazon", color: "#2b2b2b", logo: "a" },
  { name: "Spotify", color: "#1db954", textColor: "#fff", logo: "♬" },
];

export const GetStartedpage = () => {
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const contentRef = useRef(null);
  const companiesRef = useRef(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Logo animation
      timeline.from(logoRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // Hero content animation
      timeline.from(
        contentRef.current.children,
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
        },
        "-=0.3"
      );

      // Company pills animation
      timeline.from(
        companiesRef.current.children,
        {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          stagger: {
            amount: 0.8,
            from: "random",
          },
          ease: "back.out(1.7)",
        },
        "-=0.4"
      );
   

    },
    { scope: heroRef }
  );
  const navigate=useNavigate();
  const handleGetStarted=()=>{
   navigate("/user/login");
  }
  return (
    <section className="hero" ref={heroRef}>
      <img
        ref={logoRef}
        src="/logo_with_name.svg"
        alt="Hunto Logo"
        className="logo"
      />
      <div className="hero-content" ref={contentRef}>
        <div className="hero-parent">
          <h1>Find your dream job now!</h1>
        <p>
          Discover top companies hiring for thousands of jobs. Start your career
          with us today.
        </p>
        </div>
        <button className="hero-btn" onClick={handleGetStarted}>Get Started</button>
        
      </div>
      <div className="company-wrapper" ref={companiesRef}>
        {companies.map((company, index) => (
          <div
            key={index}
            className="company-pill"
            style={{
              "--pill-bg": company.color,
              "--pill-text": company.textColor || "#fff",
            }}
          >
            <span className="company-logo">{company.logo}</span>
            <span className="company-name">{company.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
