// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Find Jobs</h4>
          <p>Discover your next career opportunity</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#linkedin">LinkedIn</a>
            <a href="#twitter">Twitter</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Find Jobs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer