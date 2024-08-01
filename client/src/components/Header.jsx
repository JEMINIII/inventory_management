// src/components/Header.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import logo22 from "../images/5-removebg-preview.png";
import "./Header.css";
import Cookies from "js-cookie";

function Header({ toggleSidebar, isSidebarOpen }) {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    // Fetch user data
    axios
      .get("http://localhost:8082/api/users", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          console.log(data);
          if (data.success) {
            setAuth(true);
            setName(data.name);

            const orgId = data.orgId;
            if (orgId) {
              Cookies.set("orgId", orgId);
              axios
                .get("http://localhost:8082/org")
                .then((orgRes) => {
                  console.log(orgRes);
                  if (orgRes.status === 200) {
                    const orgData = orgRes.data.items;
                    const organization = orgData.find((org) => org.id === orgId);
                    if (organization) {
                      Cookies.set("orgName", organization.name);
                    } else {
                      console.log("Organization not found");
                    }
                  } else {
                    console.log("Unexpected response status:", orgRes.status);
                  }
                })
                .catch((err) =>
                  console.error("Error fetching organization data:", err)
                );
            } else {
              console.log("orgId not found in user data");
            }
          } else {
            setAuth(false);
          }
        } else {
          console.log("Unexpected response status:", res.status);
        }
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8082/logout", { withCredentials: true })
      .then(() => {
        Cookies.remove("orgId");
        Cookies.remove("orgName");
        window.location.href = "/login";
      })
      .catch((err) => console.error("Error during logout:", err));
  };

  if (!auth) {
    return null;
  }

  const orgName = Cookies.get("orgName");

  const menuContent = (
    <div>
      <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo22} alt="Logo" />
      </div>
      <div className="org-container">
        <span>{orgName}</span>
      </div>
      <ul className="links">
        <Popover content={menuContent} trigger="click" placement="bottom">
          <div style={{ backgroundColor: "black", color: "white" }}>
            <UserOutlined />
          </div>
        </Popover>
      </ul>
    </nav>
  );
}

export default Header;
