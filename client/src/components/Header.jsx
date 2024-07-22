// src/components/Header.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Popover, Select } from "antd";
import { useOrganization } from "../context/OrgContext";
import logo22 from "../images/5-removebg-preview.png";
import "./Header.css";

const { Option } = Select;

function Header({ toggleSidebar, isSidebarOpen }) {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState("");
  const [orgs, setOrgs] = useState([]);
  const { selectedOrg, setSelectedOrg } = useOrganization();
  const { selectedOrgId, setSelectedOrgId } = useOrganization();

  // Fetch user data
  useEffect(() => {
    axios
      .get("http://37.60.244.17:8082/api/users")
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          if (data.success) {
            setAuth(true);
            setName(data.name); // Assuming `data.name` contains the user's name
          } else {
            setAuth(false);
          }
        } else {
          console.log("Unexpected response status:", res.status);
        }
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  // Fetch organizations data
  useEffect(() => {
    axios
      .get("http://37.60.244.17:8082/org")
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          if (data.success) {
            setOrgs(data.items);
          } else {
            setAuth(false);
          }
        } else {
          console.log("Unexpected response status:", res.status);
        }
      })
      .catch((err) => console.error("Error fetching organization data:", err));
  }, []);

  // Handle logout
  const handleLogout = () => {
    axios
      .get("http://37.60.244.17:8082/logout", { withCredentials: true })
      .then(() => {
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

  const handleOrgChange = (value) => {
    // Find the selected organization based on the value
    const selectedOrganization = orgs.find((org) => org.name === value);

    if (selectedOrganization) {
      setSelectedOrg(selectedOrganization);
      setSelectedOrgId(selectedOrganization.id); // Update the ID as well

      console.log("Selected organization:", selectedOrganization);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo22} alt="Logo" />
      </div>
      <div className="org-container">
        <label htmlFor="organization-select">Select Organization:</label>
        <Select
          id="organization-select"
          value={selectedOrg?.name}
          onChange={handleOrgChange}
          style={{ width: "100%" }}
          placeholder="Select an organization"
        >
          {orgs.length > 0 ? (
            orgs.map((org) => (
              <Option key={org.id} value={org.name}>
                {org.name}
              </Option>
            ))
          ) : (
            <Option value="">No organizations found</Option>
          )}
        </Select>
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
