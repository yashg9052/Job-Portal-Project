import React, { useState } from "react";
import "../../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/slices";

export const UserLoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch=useDispatch();
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      const response = await axios.post(
        "http://localhost:5000/auth/user/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUser(response.data.user))
      
      
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data || "An error occurred"
      );
      console.log(error);
    }
  };

  return (
    <div className="login-hero ">
      <div className="hero-inner">
        <section className="auth-wrapper">
          <div className="auth-panel">
            <img src="/logo_with_name.svg" alt="Hunto Logo" className="logo" />

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="form-label">Email</label>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Registered Email"
                  className="form-input"
                />
              </div>

              <label className="form-label">Password</label>
              <div className="form-group password-group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="form-input"
                  name="password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    // Eye with slash (password visible)
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
                    // Eye without slash (password hidden)
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

              <button className="primary-btn cta-btn" type="submit">
                Sign-In
              </button>

              <div className="forgot-line">
                <a className="google-btn">Forgot Password?</a>
              </div>

              <div className="divider">
                <span>OR</span>
              </div>

              <button type="button" className="google-btn">
                <span className="google-logo" aria-hidden>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 533.5 544.3"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.1H272v104.4h146.9c-6.3 34.1-25.3 62.9-54 82.1v68.1h87.2c51-47 80.4-116.3 80.4-199.5z"
                      fill="#4285F4"
                    />
                    <path
                      d="M272 544.3c73.5 0 135.3-24.3 180.4-66.2l-87.2-68.1c-24.2 16.3-55 26-93.2 26-71.7 0-132.5-48.4-154.2-113.3H30.5v71.1C75.6 484 167 544.3 272 544.3z"
                      fill="#34A853"
                    />
                    <path
                      d="M117.8 336.7c-10.9-32.7-10.9-68 0-100.7V165h-86.8C10.5 212.5 0 241.7 0 272.1s10.5 59.6 31 87.1l86.8-22.5z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M272 107.7c39.9 0 75.8 13.7 104 40.6l78-78C413.7 24 351.9 0 272 0 167 0 75.6 60.3 30.5 150.5l86.8 71.1C139.5 156.1 200.3 107.7 272 107.7z"
                      fill="#EA4335"
                    />
                  </svg>
                </span>
                Sign-in with Google
              </button>

              <p className="signup-line">
                Don't have an account? {""}
                <button className="muted-link" onClick={()=>{navigate("/user/register")}}>Register</button>
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};