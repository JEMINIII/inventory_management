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
  const api_address = process.env.REACT_APP_API_ADDRESS;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(`${api_address}/api/users`, { withCredentials: true });
        if (userRes.status === 200 && userRes.data.success) {
          setAuth(true);
          setName(userRes.data.name);

          const orgId = userRes.data.orgId;
          if (orgId) {
            localStorage.setItem("orgId", orgId);
            Cookies.set("orgId", orgId, { secure: true, sameSite: 'Strict' });

            try {
              const orgRes = await axios.get(`${api_address}/org`, { withCredentials: true });
              if (orgRes.status === 200) {
                const orgData = orgRes.data.items;
                const organization = orgData.find(org => org.id === orgId);

                if (organization) {
                  localStorage.setItem("orgName", organization.name);
                  Cookies.set("orgName", organization.name, { secure: true, sameSite: 'Strict' });
                  setOrgName(organization.name);

                  if (organization.teams && organization.teams.length > 0) {
                    const firstTeam = organization.teams[0];
                    localStorage.setItem("selectedTeamId", firstTeam.id);
                    localStorage.setItem("selectedTeamName", firstTeam.name);
                    Cookies.set("selectedTeamId", firstTeam.id, { secure: true, sameSite: 'Strict' });
                    Cookies.set("selectedTeamName", firstTeam.name, { secure: true, sameSite: 'Strict' });
                  }
                } else {
                  console.log("Organization not found");
                }
              } else {
                console.log("Unexpected response status:", orgRes.status);
              }
            } catch (orgErr) {
              console.error("Error fetching organization data:", orgErr);
            }
          } else {
            console.log("orgId not found in user data");
          }
        } else {
          setAuth(false);
        }
      } catch (userErr) {
        console.error("Error fetching user data:", userErr.response?.data || userErr.message || userErr);
      }
    };

    fetchUserData();
  }, [api_address]);

  const handleLogout = async () => {
    try {
      await axios.get(`${api_address}/logout`, { withCredentials: true });

      // Remove orgId and orgName from both localStorage and cookies
      localStorage.removeItem("orgId");
      localStorage.removeItem("orgName");
      localStorage.removeItem("selectedTeamId");
      localStorage.removeItem("selectedTeamName");
      Cookies.remove("orgId");
      Cookies.remove("orgName");
      Cookies.remove("selectedTeamId");
      Cookies.remove("selectedTeamName");

      window.location.href = "/login";
    } catch (err) {
      console.error("Error during logout:", err);
    }
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
          <div style={{ backgroundColor: 'black', color: 'white' }}>
            <UserOutlined />
          </div>
        </Popover>
      </ul>
    </nav>
  );
}

export default Header;
