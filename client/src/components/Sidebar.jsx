import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import TeamSelector from "./TeamSelector";
import './Sidebar.css';
import { RightCircleOutlined, LeftCircleOutlined, UnorderedListOutlined, ArrowUpOutlined, ArrowDownOutlined, CarryOutOutlined, MoneyCollectOutlined, TeamOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import axios from "axios";
import { TeamContext } from "../context/TeamContext";

const iconComponents = {
  UnorderedListOutlined: UnorderedListOutlined,
  ArrowUpOutlined: ArrowUpOutlined,
  ArrowDownOutlined: ArrowDownOutlined,
  CarryOutOutlined: CarryOutOutlined,
  MoneyCollectOutlined: MoneyCollectOutlined,
  TeamOutlined: TeamOutlined,
};

const Sidebar = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const toggleCollapsed = () => setMenuCollapsed(!menuCollapsed);

  const { SubMenu } = Menu;
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const handleMenuClick = (id) => setSelectedMenuItem(id);

  const [menuItems, setMenuItems] = useState([]);
  const { teamId } = useContext(TeamContext);

  useEffect(() => {
    if (teamId) {
      axios.get("http://localhost:8082/sidebar", { params: { teamId } })
        .then((response) => setMenuItems(response.data))
        .catch((error) => console.error("Error fetching menu items:", error));
    } else {
      setMenuItems([]); // Clear menu items if no team is selected
    }
  }, [teamId]);

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

  return (
    <div className="sidebar-container">
      <Menu
        className="menu"
        style={{ backgroundColor: 'black', color: 'white' }}
        mode="inline"
        theme="dark"
        inlineCollapsed={menuCollapsed}
        onClick={({ id }) => handleMenuClick(id)}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
      >
        {/* Team Selector Menu Item */}
        <Menu.Item key="teamSelector" icon={<TeamOutlined />}>
          <TeamSelector />
        </Menu.Item>

        {Object.values(nestedMenuItems).map((menuItem) =>
          menuItem.submenus.length > 0 ? (
            <SubMenu
              key={menuItem.id}
              icon={menuItem.icon ? React.createElement(iconComponents[menuItem.icon]) : null}
              title={menuItem.label}
            >
              {menuItem.submenus.map((submenu) => (
                <Menu.Item
                  key={submenu.id}
                  icon={submenu.icon ? React.createElement(iconComponents[submenu.icon]) : null}
                >
                  {submenu.label}
                  <Link to={submenu.route}></Link>
                </Menu.Item>
              ))}
            </SubMenu>
          ) : (
            <Menu.Item
              key={menuItem.id}
              icon={menuItem.icon ? React.createElement(iconComponents[menuItem.icon]) : null}
            >
              {menuItem.label}
              <Link to={menuItem.route}></Link>
            </Menu.Item>
          )
        )}
      </Menu>
    </div>
  );
};

export default Sidebar;
