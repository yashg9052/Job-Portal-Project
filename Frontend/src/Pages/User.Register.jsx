import React, { useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const UserRegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      const role = e.target.role.value;
      const response = await axios.post(
        "http://localhost:5000/auth/user/register",
        { name, email, password, role },
        { withCredentials: true }
      );
      // console.log(response);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data || "An error occurred"
      );
      console.log(err);
    }
  };

  return (
    <div className="register-hero">
      <div className="auth-card">
        <img src="/logo_with_name.svg" alt="Hunto Logo" className="logo" />

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input name="name" type="text" placeholder="Enter your full name" />

          <label>Email</label>
          <input type="email" name="email" placeholder="Enter your email" />

          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
            />
            <button
              type="button"
              className="eye-btn"
              aria-label="toggle password visibility"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="3"
                    y1="3"
                    x2="21"
                    y2="21"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          <label>Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password"
              placeholder="Confirm password"
            />
            <button
              type="button"
              className="eye-btn"
              aria-label="toggle confirm password visibility"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="3"
                    y1="3"
                    x2="21"
                    y2="21"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                    stroke="#9aa0a6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          <label>Role</label>
          <select defaultValue="applicant" name="role">
            <option value="applicant">Applicant</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>

          <button className="primary-btn" type="submit">
            Register
          </button>

          {/* OR divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Google Register */}
          <button type="button" className="google-btn">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
            />
            Register with Google
          </button>

          <p className="auth-footer">
            Already have an account?
            <button
              className="muted-link"
              onClick={() => {
                navigate("/user/login");
              }}
            >
              Sign-in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};