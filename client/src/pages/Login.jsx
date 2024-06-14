import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";
import {Button} from 'antd'
 
const Login = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorPopup, setErrorPopup] = useState(""); // For error popup
  const navigate = useNavigate();
  let errorTimeout;

  useEffect(() => {
    if (errorPopup) {
      errorTimeout = setTimeout(() => {
        setErrorPopup("");
      }, 3001);
    }
    return () => clearTimeout(errorTimeout);
  }, [errorPopup]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors({});
    setErrorPopup(""); // Clear popup on input change
    clearTimeout(errorTimeout); // Clear previous timeout
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isSignUpActive ? "http://localhost:8082/register" : "http://localhost:8082/login";
    axios
      .post(url, values, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
        if (res.data.errors) {
          const errorMessages = res.data.errors.reduce((acc, error) => {
            acc[error.param] = error.msg;
            return acc;
          }, {});
          setErrors(errorMessages);
        } else {
          setErrors({});
          if (res.data.message === "Login successful") {
            Cookies.set("token", res.data.token, { expires: 1 });
            navigate("/");
          } else if (res.data.message === "User registered successfully") {
            setIsSignUpActive(false);
            setValues({ name: "", email: "", password: "" });
          }
        }
      })
      .catch((err) => {
        setErrorPopup("!! An error occurred. Please try again.");
      });
  };

  const toggleSignUp = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  return (
    <div className="body">
      {errorPopup && (
        <div className="error-popup">
          <p>{errorPopup}</p>
          {/* <Button onClick={() => setErrorPopup("")}></Button> */}
        </div>
      )}
      <div className={`container ${isSignUpActive ? "right-panel-active" : ""}`} id="container">
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span>
            {errors.general && <p className="text-danger">{errors.general}</p>}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
            <input
              
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && <p className="text-danger">{errors.password}</p>}
            <a href="#" className="forgot">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={values.name}
              onChange={handleInput}
            />
            {errors.name && <p className="text-danger">{errors.name}</p>}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={values.email}
              onChange={handleInput}
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleInput}
            />
            {errors.password && <p className="text-danger">{errors.password}</p>}
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button onClick={toggleSignUp} id="signInBtn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button onClick={toggleSignUp} id="signUpBtn">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
