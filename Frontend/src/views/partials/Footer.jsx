import React from "react";
import styles from "../../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={`${styles.footer}`}>
      <div className={`${styles.footerContent}`}>
        <div className={`${styles.footerSection}`}>
          <h4>Find Jobs</h4>
          <p>Discover your next career opportunity</p>
        </div>
        <div className={`${styles.footerSection}`}>
          <h4>Quick Links</h4>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
        <div className={`${styles.footerSection}`}>
          <h4>Follow Us</h4>
          <div className={`${styles.socialLinks}`}>
            <a href="#linkedin">LinkedIn</a>
            <a href="#twitter">Twitter</a>
          </div>
        </div>
      </div>
      <div className={`${styles.footerBottom}`}>
        <p>© 2024 Find Jobs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;