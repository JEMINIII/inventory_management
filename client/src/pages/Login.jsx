import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [backendError, setBackendError] = useState([]);
  const [frontendError, setFrontendError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      setBackendError([{ field: "email", msg: "Please fill in all fields" }]);
      return;
    }
    axios
      .post("http://localhost:8082/login", values)
      .then((res) => {
        console.log("Server response:", res.data);
        if (res.data.errors) {
          setBackendError(res.data.errors);
        } else {
          setBackendError([]);
          if (res.data.message === "Login successful") {
            Cookies.set("token", res.data.token, { expires: 1 });
            navigate("/");
          } else {
            console.log("Login unsuccessful:", res.data.message);
            // Handle unsuccessful login
          }
        }
      })
      .catch((err) => {
        console.error("Error logging in:", err.response.data);
        setFrontendError("Invalid email or password");
      });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Remove the error message for the input field
    setBackendError((prevErrors) =>
      prevErrors.filter((error) => error.field !== name)
    );
    setFrontendError(""); // Clear frontend error on input change
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light vh-100">
      <div className="bg-white p-3 rounded w-25 border border shadow">
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "1.5rem",
              fontWeight: "bold",
              backgroundImage:
                "linear-gradient(to right, #e66465, #9198e5, #e66465, #9198e5, #e66465)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Login
          </h2>
        </div>
        {frontendError && <p className="text-danger">{frontendError}</p>}
        {backendError.map((error, index) => {
          if (error.field === "email" || error.field === "password" || error.field === "passwordNotMatch") {
            return (
              <p key={index} className="text-danger">
                {error.msg}
              </p>
            );
          }
          return null;
        })}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={handleInput}
              className="form-control rounded-0"
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundImage: "linear-gradient(to right, #e66465, #9198e5)",
            }}
            className="btn btn-success w-100 rounded-0"
          >
            Login
          </button>
          <p>You are agree to our terms and policies</p>
          <Link
            to="/register"
            className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none"
          >
            Create account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
