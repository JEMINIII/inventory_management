import React, { useEffect, useState } from "react";
import Logo from "../images/4-removebg-preview.png";
import logo22 from "../images/5-removebg-preview.png";
import axios from "axios";
import { Link } from "react-router-dom";
import './Header.css';
import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";

function Header({ toggleSidebar, isSidebarOpen }) {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/users")
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const data = res.data;
          console.log(data);
          if (data.success === true) {
            setAuth(true);
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
      .get("http://localhost:8082/logout", { withCredentials: true })
      .then((res) => {
        window.location.href = "/login";
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="navbar">
      <div className="toggle-button">
        <Button onClick={toggleSidebar}>
          {isSidebarOpen ? <MenuOutlined /> : <MenuOutlined />}
        </Button>
      </div>
      <div className="logo">
        <img src={logo22} alt="" />
      </div>
      
      <div className="links">
        <span className="dropdown">
          <img className="logo22" src={Logo} alt="" />
          <div className="dropdown-content">
            <ul className="navbar-nav ml-auto">
              {auth ? (
                <>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">
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
