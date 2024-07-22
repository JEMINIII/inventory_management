// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Register.css";

// const Register = () => {
//   const [values, setValues] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [isSignUpActive, setIsSignUpActive] = useState(true);
//   const navigate = useNavigate();

//   const handleInput = (e) => {
//     setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!values.name || !values.email || !values.password) {
//       setErrors({
//         name: !values.name ? "Name is required" : "",
//         email: !values.email ? "Email is required" : "",
//         password: !values.password ? "Password is required" : "",
//       });
//       return;
//     }
//     axios
//       .post("http://37.60.244.17:8082/register", values)
//       .then((res) => {
//         if (res.data.message === "User registered successfully") {
//           navigate("/login");
//         }
//       })
//       .catch((err) => {
//         setErrors((prev) => ({ ...prev, email: "Email already exists" }));
//       });
//   };

//   const toggleSignUp = () => {
//     setIsSignUpActive(!isSignUpActive);
//   };

//   return (
//     <div className={`container ${isSignUpActive ? "right-panel-active" : ""}`} id="container">
//       <div className="form-container sign-in-container">
//         <form onSubmit={handleSubmit}>
//           <h1>Sign in</h1>
//           <div className="social-container">
//             <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
//             <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
//             <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
//           </div>
//           <span>or use your account</span>
//           {errors.email && <p className="text-danger">{errors.email}</p>}
//           {errors.password && <p className="text-danger">{errors.password}</p>}
//           <div className="infield">
//             <input
//               type="email"
//               placeholder="Email"
//               name="email"
//               onChange={handleInput}
//             />
//             <label></label>
//           </div>
//           <div className="infield">
//             <input
//               type="password"
//               placeholder="Password"
//               name="password"
//               onChange={handleInput}
//             />
//             <label></label>
//           </div>
//           <a href="#" className="forgot">Forgot your password?</a>
//           <button type="submit">Sign In</button>
//         </form>
//       </div>
//       <div className="form-container sign-up-container">
//         <form onSubmit={handleSubmit}>
//           <h1>Create Account</h1>
//           <div className="social-container">
//             <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
//             <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
//             <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
//           </div>
//           <span>or use your email for registration</span>
//           {errors.name && <p className="text-danger">{errors.name}</p>}
//           {errors.email && <p className="text-danger">{errors.email}</p>}
//           {errors.password && <p className="text-danger">{errors.password}</p>}
//           <div className="infield">
//             <input
//               type="text"
//               placeholder="Name"
//               name="name"
//               onChange={handleInput}
//             />
//             <label></label>
//           </div>
//           <div className="infield">
//             <input
//               type="email"
//               placeholder="Email"
//               name="email"
//               onChange={handleInput}
//             />
//             <label></label>
//           </div>
//           <div className="infield">
//             <input
//               type="password"
//               placeholder="Password"
//               name="password"
//               onChange={handleInput}
//             />
//             <label></label>
//           </div>
//           <button type="submit">Sign Up</button>
//         </form>
//       </div>
//       <div className="overlay-container">
//         <div className="overlay">
//           <div className="overlay-panel overlay-left">
//             <h1>Welcome Back!</h1>
//             <p>To keep connected with us please login with your personal info</p>
//             <button onClick={toggleSignUp} id="signInBtn">Sign In</button>
//           </div>
//           <div className="overlay-panel overlay-right">
//             <h1>Hello, Friend!</h1>
//             <p>Enter your personal details and start your journey with us</p>
//             <button onClick={toggleSignUp} id="signUpBtn">Sign Up</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
