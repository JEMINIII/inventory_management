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
  const [orgName, setOrgName] = useState(localStorage.getItem("orgName") || "");

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/users", { withCredentials: true })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const data = res.data;
          
          if (data.success) {
            setAuth(true);
            setName(data.name);
  
            const orgId = data.orgId;
            if (orgId) {
              // Store orgId in both localStorage and cookies
              localStorage.setItem("orgId", orgId);
              Cookies.set("orgId", orgId);
  
              axios
                .get("http://localhost:8082/org")
                .then((orgRes) => {
                  console.log(orgRes);
                  if (orgRes.status === 200) {
                    const orgData = orgRes.data.items;
                    const organization = orgData.find(
                      (org) => org.id === orgId
                    );
                    if (organization) {
                      // Store orgName in both localStorage and cookies
                      localStorage.setItem("orgName", organization.name);
                      Cookies.set("orgName", organization.name);
  
                      // Update state to trigger re-render
                      setOrgName(organization.name);
                      
                      // Assuming the response contains teams data
                      if (organization.teams && organization.teams.length > 0) {
                        const firstTeam = organization.teams[0]; 
                        
                        // Store the first team's id and name as selected team
                        localStorage.setItem("selectedTeamId", firstTeam.id);
                        localStorage.setItem("selectedTeamName", firstTeam.name);
                        Cookies.set("selectedTeamId", firstTeam.id);
                        Cookies.set("selectedTeamName", firstTeam.name);
                      }
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
      .catch((err) => {
        console.error("Error fetching user data:", err.response?.data || err.message || err);
      });
      
  }, []);
  

  const handleLogout = () => {
    axios
      .get("http://localhost:8082/logout", { withCredentials: true })
      .then(() => {
        // Remove orgId and orgName from both localStorage and cookies
        localStorage.removeItem("orgId");
        localStorage.removeItem("orgName");
        localStorage.removeItem("selectedTeamName");
        localStorage.removeItem("selectedTeamId");
        Cookies.remove("orgId");
        Cookies.remove("orgName");

        window.location.href = "/login";
      })
      .catch((err) => console.error("Error during logout:", err));
  };

  if (!auth) {
    return null;
  }

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
