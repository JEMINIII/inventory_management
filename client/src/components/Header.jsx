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
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.Status === "success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => console.log(err));
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
      <div className="container">
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
                        style={{ backgroundColor: "green" }}
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
    </div>
  );
}

export default Header;
