import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Modal } from "antd";
import CreateOrganization from "../pages/create_org";  // Import CreateOrganization component
import logo22 from "../images/5-removebg-preview.png";
import "./Header.css";
import Cookies from "js-cookie";

function Header({ toggleSidebar, isSidebarOpen }) {
  const [auth, setAuth] = useState(false); // Controls authentication status
  const [name, setName] = useState(localStorage.getItem("loggedInUser") || "");
  const [orgName, setOrgName] = useState(localStorage.getItem("orgName") || "");
  const [isCreateOrgModalVisible, setCreateOrgModalVisible] = useState(false);
  const api_address = process.env.REACT_APP_API_ADDRESS;
  const [loading, setLoading] = useState(true); // Optional loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(`${api_address}/api/users`, {
          withCredentials: true,
        });
        if (userRes.status === 200 && userRes.data.success) {
          const userName = userRes.data.name;
          setAuth(true);
          setName(userName);
          localStorage.setItem("loggedInUser", userName);

          const orgId = userRes.data.orgId;
          if (orgId) {
            localStorage.setItem("orgId", orgId);
            Cookies.set("orgId", orgId, { secure: true, sameSite: "Strict" });
            const orgRes = await axios.get(`${api_address}/org`, {
              withCredentials: true,
            });
            if (orgRes.status === 200) {
              const organization = orgRes.data.items.find(
                (org) => org.id === orgId
              );
              if (organization) {
                localStorage.setItem("orgName", organization.name);
                Cookies.set("orgName", organization.name, {
                  secure: true,
                  sameSite: "Strict",
                });
                setOrgName(organization.name);
              }
            }
          }
        } else {
          setAuth(false);
        }
      } catch (userErr) {
        console.error("Error fetching user data:", userErr);
      } finally {
        setLoading(false); // Stop loading when the user data is fetched
      }
    };

    fetchUserData();
  }, [api_address]);

  const handleLogout = async () => {
    try {
      await axios.get(`${api_address}/logout`, { withCredentials: true });
      localStorage.removeItem("orgId");
      localStorage.removeItem("orgName");
      localStorage.removeItem("loggedInUser");
      Cookies.remove("orgId");
      Cookies.remove("orgName");
      setName("");
      setAuth(false);
      window.location.href = "/login";
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleCreateOrg = (newOrgData) => {
    console.log("Organization created with data:", newOrgData);
    setCreateOrgModalVisible(false);
  };

  const showCreateOrgModal = () => {
    setCreateOrgModalVisible(true);
  };

  const hideCreateOrgModal = () => {
    setCreateOrgModalVisible(false);
  };

  // Dropdown menu items
  const menuItems = (
    <Menu>
      <Menu.Item key="1">
        <span>Logged in as: {name}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
      <Menu.Item key="3" onClick={showCreateOrgModal}>
        Create Organization
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {auth && ( // Show header only if user is authenticated
        <nav className="navbar">
          <div className="logo">
            <img src={logo22} alt="Logo" />
          </div>
          <div className="org-container">
            <p
              style={{
                fontFamily: "'Bungee Tint', sans-serif",
                fontSize: "26px",
              }}
            >
              {orgName}
            </p>
          </div>
          <ul className="links" style={{ marginLeft: "auto" }}>
            <Dropdown overlay={menuItems} trigger={["click"]}>
              <Button
                type="text"
                icon={<UserOutlined />}
                style={{ color: "white" }}
              />
            </Dropdown>
          </ul>
        </nav>
      )}
      {/* Create Organization Modal */}
      {isCreateOrgModalVisible && (
        <CreateOrganization
          onCreate={handleCreateOrg}
          onCancel={hideCreateOrgModal}
        />
      )}
    </>
  );
}

export default Header;
