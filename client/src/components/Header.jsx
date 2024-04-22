import React, { useEffect, useState } from "react";
import Logo from "../images/4-removebg-preview.png";
import logo22 from "../images/5-removebg-preview.png";
import axios from "axios";
import { Link } from "react-router-dom";

function Header() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  
  

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/users")
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const data = res.data;
          console.log("Data:", data);
          if (data.success === true) {
            setAuth(true);
            const firstName = data.users[0].name; 
            console.log("First Name:", firstName); 
            setName(firstName);
          } else {
            setAuth(false);
          }
        } else {
          console.log("Unexpected response status:", res.status);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);
  
  

  const handleLogout = () => {
    axios
      .get("http://localhost:8082/logout")
      .then((res) => {
        window.location.href = "/login";
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={logo22} alt="" />
      </div>

      <div className="links">
        <span className="dropdown">
          <img className="logo22" src={Logo} alt="" />
          <div className="dropdown-content">
            <ul className="navbar-nav ml-auto">
              {auth ? (
                // <div className="d-flex align-items-center gap-5">
                <>
                  <li className="nav-item">
                    <Link
                      to="/profile"
                      style={{ backgroundColor: "pink" }}
                      className="nav-link"
                    >
                      {name}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link onClick={handleLogout}>Logout</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              )}
            </ul>
            <a href="/">Settings</a>
          </div>
        </span>
      </div>
    </div>
  );
}

export default Header;
