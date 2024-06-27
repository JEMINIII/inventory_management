import React, { useEffect, useState } from "react";
import Logo from "../images/4-removebg-preview.png";
import logo22 from "../images/5-removebg-preview.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import './Header.css';

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
    <nav className="navbar">
      <div className="toggle-button">
        <Button onClick={toggleSidebar}>
          <MenuOutlined />
        </Button>
      </div>
      <div className="logo">
        <img src={logo22} alt="" />
      </div>
      <ul className="links">
        <li className="dropdown">
          <img className="logo22" src={Logo} alt="" />
          <div className="dropdown-content">
            {auth ? (
              <>
                <li>
                  <Link to="/profile">{name}</Link>
                </li>
                <li>
                  <Link onClick={handleLogout}>Logout</Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            <li>
              <a href="/">Settings</a>
            </li>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
