import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [selectedOrg, setSelectedOrg] = useState("");
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    org_id: selectedOrg, 
  });

  const api_address = process.env.REACT_APP_API_ADDRESS;
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [inviteCode, setInviteCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [organizations, setOrganizations] = useState([]);
  
  // const [values, setValues] = useState({ name: "", email: "", password: "" });
  // const [inviteCode, setInviteCode] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState({});

  // Fetch the list of organizations on component mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(`${api_address}/org`);
        setOrganizations(response.data.items);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("inviteCode");
    if (code) {
      setInviteCode(code);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [location.search]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors({});
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const url = isSignUpActive ? `${api_address}/register` : `${api_address}/login`;

  const payload = { 
    ...values,
    org_id: selectedOrg ? selectedOrg : null, 
  };

  if (isSignUpActive && inviteCode) {
    payload.inviteCode = inviteCode;
  }

  setLoading(true);

  axios
    .post(url, payload, { withCredentials: true })
    .then((res) => {
      if (res.data.errors) {
        const errorMessages = res.data.errors.reduce((acc, error) => {
          acc[error.param] = error.msg;
          return acc;
        }, {});
        setErrors(errorMessages);
        toast.error("Please check the form for errors.");
      } else {
        setErrors({});
        if (res.data.message === "Login successful") {
          const token = res.data.token;
          const orgId = res.data.user.org_id;

          // Set token and orgId in cookies/localStorage
          Cookies.set("token", token, { expires: 1 });
          localStorage.setItem("orgId", orgId);
          localStorage.setItem("token", token);

          // Fetch teams based on orgId
          axios
            .get(`${api_address}/team?orgId=${orgId}`, {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            })
            .then((teamResponse) => {
              const teams = teamResponse.data.items;

              if (teams && teams.length > 0) {
                const firstTeam = teams[0];

                // Set teamId and teamName in localStorage
                localStorage.setItem("selectedTeamId", firstTeam.id);
                localStorage.setItem("selectedTeamName", firstTeam.name);

                console.log(`Selected Team: ${firstTeam.name}`);
              } else {
                console.log("No teams available for this organization.");
                // Optionally, show a toast or message that no teams are available
                toast.info("No teams available for this organization.");
              }

              // Navigate to the dashboard or homepage after successful login
              navigate("/", { replace: true });
              window.location.reload();
            })
            .catch((teamError) => {
              console.error("Error fetching teams:", teamError);
              // Handle error gracefully when no teams exist
              if (teamError.response && teamError.response.status === 404) {
                // No teams found for the organization, handle this case
                toast.info("No teams available for this organization.");

                // Navigate to a default dashboard even if there are no teams
                navigate("/", { replace: true });
                window.location.reload();
              } else {
                toast.error("Failed to fetch teams. Please try again.");
              }
            });
        } else if (res.data.message === "User registered successfully") {
          toast.success("User registered successfully! Please sign in.");
          
          // Switch to the Sign In tab
          setIsSignUpActive(false);
          
          // Reset form values
          setValues({ name: "", email: "", password: "" });
          setInviteCode("");
        }
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      toast.error("An error occurred. Please try again.");
    })
    .finally(() => setLoading(false));
};


  

  const toggleSignUp = () => {
    setIsSignUpActive(!isSignUpActive);
    setErrors({});
    setInviteCode("");
  };

  // Google login integration
  const googleLogin = useGoogleLogin({
    flow: "auth-code",  // Use auth-code flow instead of implicit
    redirectUri: `${api_address}/auth/google/callback`,  // Use a redirect URI
    onSuccess: async (codeResponse) => {
      try {
        // Redirect to your server's OAuth route
        window.location.href = `${api_address}/auth/google`;
      } catch (error) {
        console.error("Google login failed:", error);
        toast.error("An error occurred with Google login. Please try again.");
      }
    },
    onError: (error) => {
      console.log("Google Login Failed:", error);
      toast.error("Google login failed.");
    },
  });

  
  
  


  return (
    <div className="body">
      <ToastContainer />
      <div
        className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
        id="container"
      >
        <div className="form-container sign-in-container">
          <form className="signin" onSubmit={handleSubmit}>
            <h1>Sign in</h1>
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
            {errors.password && (
              <p className="text-danger">{errors.password}</p>
            )}
            <a href="#" className="forgot">
              Forgot your password?
            </a>
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => googleLogin()}
              className="google-btn"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign in with Google"}
            </button>
          </form>
        </div>
        <div className="form-container sign-up-container">
      <form className="signup" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
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
        
        <input
          type="text"
          placeholder="Invitation Code"
          name="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />

        {/* Organization dropdown */}
        <select
  name="org_id"
  value={selectedOrg}
  onChange={(e) => {
    setSelectedOrg(e.target.value); // Update selectedOrg state
    setValues((prevValues) => ({ ...prevValues, org_id: e.target.value })); // Update org_id in values
  }}
  required
>
  <option value="">Select Organization</option>
  {organizations.map((org) => (
    <option key={org.id} value={org.id}>
      {org.name}
    </option>
  ))}
</select>


        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button onClick={toggleSignUp} id="signInBtn">
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button onClick={toggleSignUp} id="signUpBtn">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
