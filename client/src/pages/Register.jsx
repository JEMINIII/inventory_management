import React, { useState } from 'react';

import axios from 'axios';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

const Register = () => {
    const [values,setValues] = useState({
        name:"",
        email:"",
        password:""
    })
    const handleInput = (e)=>{
      setValues(prev => ({...prev, [e.target.name]:[e.target.value]}))
    }
    const navigate = useNavigate()
    const handleSubmit = (e)=>{
      e.preventDefault();
      if (!values.name || !values.email || !values.password) {
        alert("Please fill in all fields");
        return;
      }
      axios.post('http://localhost:8082/auth/register',values)
      .then(res=>{
        if(res.data.Status === "success"){
          navigate("/login")
        }else{
          alert("Error")
        }
      })
      .then(err=>console.log(err));

    }
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
            Sign-Up
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              onChange = {handleInput}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange = {handleInput}
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
              onChange = {handleInput}
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
            Sign up
          </button>
          <p>You are agree to our terms and policies</p>
          <Link
            to="/login"
            className="btn btn-default border w-100 bg-light rounded-0"
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
