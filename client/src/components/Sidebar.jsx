import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import TeamSelector from "./TeamSelector";
import "./Sidebar.css";
import {
  RightCircleOutlined,
  LeftCircleOutlined,
  UnorderedListOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CarryOutOutlined,
  MoneyCollectOutlined,
  TeamOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { TeamContext } from "../context/TeamContext";

const iconComponents = {
  UnorderedListOutlined: UnorderedListOutlined,
  ArrowUpOutlined: ArrowUpOutlined,
  ArrowDownOutlined: ArrowDownOutlined,
  CarryOutOutlined: CarryOutOutlined,
  MoneyCollectOutlined: MoneyCollectOutlined,
  TeamOutlined: TeamOutlined,
};

const api_address = process.env.REACT_APP_API_ADDRESS;
const renderIcon = (iconName) => {
  return iconName ? React.createElement(iconComponents[iconName]) : null;
};
const Sidebar = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const toggleCollapsed = () => setMenuCollapsed(!menuCollapsed);
 const [sidebarItems, setSidebarItems] = useState([]);
  const { SubMenu } = Menu;
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const handleMenuClick = (id) => setSelectedMenuItem(id);

  const [menuItems, setMenuItems] = useState([]);
  // const { teamId } = useContext(TeamContext);
  const [auth, setAuth] = useState(false);
  // const [teamId,setTeamId] = useState([])
  const { teamId,token } = useContext(TeamContext);
  console.log(teamId)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${api_address}/api/users`, {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
        });
        if (res.status === 200 && res.data.success === true) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);
  // const token = localStorage.getItem('token');

  const orgId = localStorage.getItem("orgId")
  
  // useEffect(() => {
  //   if (orgId) {
  //     axios
  //       .get(`${api_address}/team`, {
  //         params: { orgId },
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => setTeamId(response.data.items[0].id))
        
        
  //       .catch((error) => console.error("Error fetching menu items:", error));
  //   } else {
  //     setTeamId([]);
  //   }
  // }, [orgId]);

  axios
  .get(`${api_address}/team?orgId=${orgId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  })
  .then((teamResponse) => {
    const teams = teamResponse.data.items;})
  .catch((err) => {
      console.error("Error:", err);
      console.error("An error occurred. Please try again.");
    })



  // console.log(teamId)

  // useEffect(() => {
  //   const selectedOrgId = Cookies.get('orgId'); // Ensure orgId is fetched from cookies
  //   const token = Cookies.get('token'); // Ensure token is fetched from cookies
  
  //   if (teamId && selectedOrgId && token) {
  //     axios
  //       .get("http://localhost:8082/sidebar", {
  //         params: { teamId, orgId: selectedOrgId }, // Use params object
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Pass the token in the headers
  //         },
  //       })
  //       .then((response) => {
  //         setMenuItems(response.data);
  //         console.log("Sidebar items fetched:", response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching sidebar items:", error.response || error.message);
  //       });
  //   } else {
  //     setMenuItems([]);
  //     console.log("Missing required parameters for fetching sidebar items.");
  //   }
  // }, [teamId, orgId]);
  
  // useEffect(() => {
  //   const selectedOrgId = localStorage.getItem('orgId');
  //   const token = Cookies.get('token');


  //   if (teamId && selectedOrgId) {
  //     axios
  //       .get(`${api_address}/sidebar?teamId=${teamId}&orgId=${selectedOrgId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //         withCredentials: true,
        
  //       })
  //       .then((response) => {
  //         if (response.data) {
  //           const fetchedSidebarItems = response.data;
  //           setSidebarItems(fetchedSidebarItems);
  //           console.log("Sidebar items fetched:", fetchedSidebarItems);
  //         } else {
  //           console.error("Failed to fetch sidebar items:", response.data.message || "Unknown error");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching sidebar items:", error);
  //       });
  //   }
  // }, [teamId]); 

  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    const teamId = localStorage.getItem('selectedTeamId');
    const token = localStorage.getItem('token');
    if (orgId) {
      axios
        .get(`${api_address}/sidebar`, { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { teamId,orgId },
          withCredentials: true,
          
        })
        .then((response) => setMenuItems(response.data))
        .catch((error) => console.error("Error fetching menu items:", error));
    } else {
      setMenuItems([]); // Clear menu items if no team is selected
    }
  }, [teamId,orgId]);

  const nestedMenuItems = {};
  menuItems.forEach((item) => {
    if (item.parent_id === null) {
      nestedMenuItems[item.id] = { ...item, submenus: [] };
    } else {
      if (nestedMenuItems[item.parent_id]) {
        nestedMenuItems[item.parent_id].submenus.push(item);
      }
    }
  });

  const [openKeys, setOpenKeys] = useState([]);
  const handleOpenChange = (keys) => setOpenKeys(keys);

  if (!auth) {
    return null;
  }

  return (
    <div className="sidebar-container">
      <Menu
        className="menu"
        style={{ backgroundColor: "black", color: "white" }}
        mode="inline"
        theme="dark"
        inlineCollapsed={menuCollapsed}
        onClick={({ key }) => handleMenuClick(key)}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
      >
        <div className="toggle-button">
          <button onClick={toggleCollapsed}>
            <MenuOutlined />
          </button>
        </div>

        <SubMenu
          key="teamSelector"
          icon={<TeamOutlined />}
          title="Select Team"
        >
          <div style={{ padding: "10px" }}>
            <TeamSelector />
          </div>
        </SubMenu>

        {Object.values(nestedMenuItems).length === 0 ? (
          <p>No menu items available</p>
        ) : (
          Object.values(nestedMenuItems).map((menuItem) =>
            menuItem.submenus.length > 0 ? (
              <SubMenu
                key={menuItem.id}
                icon={renderIcon(menuItem.icon)}
                title={menuItem.label}
              >
                {menuItem.submenus.map((submenu) => (
                  <Menu.Item key={submenu.id} icon={renderIcon(submenu.icon)}>
                    {submenu.label}
                    <Link to={submenu.route}></Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item key={menuItem.id} icon={renderIcon(menuItem.icon)}>
                {menuItem.label}
                <Link to={menuItem.route}></Link>
              </Menu.Item>
            )
          )
        )}
      </Menu>
    </div>
  );
};

export default Sidebar;
