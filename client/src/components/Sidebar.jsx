import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  // AppstoreOutlined,
  // ContainerOutlined,
  // DesktopOutlined,
  // MailOutlined,
  // MenuFoldOutlined,
  // MenuUnfoldOutlined,
  // PieChartOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import {
  UnorderedListOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CarryOutOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";

import { Button, Menu, item, Card } from "antd";
import axios from "axios";

const iconComponents = {
  UnorderedListOutlined: UnorderedListOutlined,
  ArrowUpOutlined: ArrowUpOutlined,
  ArrowDownOutlined: ArrowDownOutlined,
  CarryOutOutlined: CarryOutOutlined,
  MoneyCollectOutlined: MoneyCollectOutlined,
};

// const items = [
//   { key: "1", label: "Item List", icon: <PieChartOutlined />, route: "/" },
//   { key: "2", label: "Stock In", icon: <DesktopOutlined />, route: "/create" },
//   {
//     key: "3",
//     label: "Stock Out",
//     icon: <ContainerOutlined />,
//     route: "/stockout",
//   },
//   { key: "4", label: "Adjust", icon: <ContainerOutlined /> },
//   { key: "5", label: "Transaction", icon: <ContainerOutlined /> },
//   {
//     key: "sub1",
//     label: "Purchase & Sales",
//     icon: <MailOutlined />,
//     items: [
//       { key: "6", label: "Bundles" },
//       { key: "7", label: "Purchases" },
//       { key: "8", label: "Sales" },
//       { key: "9", label: "Sales Analysis" },
//     ],
//   },
//   {
//     key: "sub2",
//     label: "Print Barcode",
//     icon: <MailOutlined />,
//     items: [
//       { key: "10", label: "Item" },
//       { key: "11", label: "Bundle" },
//     ],
//   },
//   {
//     key: "sub3",
//     label: "Other Features",
//     icon: <MailOutlined />,
//     items: [
//       { key: "12", label: "Low Stock Alert" },
//       { key: "13", label: "Past Quantity" },
//       { key: "14", label: "Inventory Link" },
//       { key: "15", label: "Inventory Count" },
//     ],
//   },
//   {
//     key: "sub4",
//     label: "Reports",
//     icon: <AppstoreOutlined />,
//     items: [
//       { key: "16", label: "Summary" },
//       { key: "17", label: "Dashboard" },
//       { key: "18", label: "Analytics" },
//     ],
//   },
//   {
//     key: "sub5",
//     label: "Data Center",
//     icon: <AppstoreOutlined />,
//     items: [
//       { key: "19", label: "Item" },
//       { key: "20", label: "Attribute" },
//       { key: "21", label: "Partners" },
//     ],
//   },
//   {
//     key: "sub6",
//     label: "Settings",
//     icon: <AppstoreOutlined />,
//     items: [
//       { key: "22", label: "User" },
//       { key: "23", label: "Team" },
//       { key: "24", label: "Members" },
//       { key: "25", label: "Integration & API" },
//       { key: "26", label: "Billing" },
//     ],
//   },
// ];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const toggleCollapsed = () => {
    // setCollapsed(!collapsed);
    setMenuCollapsed(!menuCollapsed);
  };
  const { SubMenu } = Menu;
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleMenuClick = (id) => {
    setSelectedMenuItem(id);
  };

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8082/sidebar")
      .then((response) => {
        setMenuItems(response.data);
        // console.log(menuItems);
        // const noQuotes = menuItems[0].icon.split('"').join('');
        // console.log(noQuotes)
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error);
      });
  }, []);

  const nestedMenuItems = {};
  menuItems.forEach((item) => {
    if (item.parent_id === null) {
      nestedMenuItems[item.id] = { ...item, submenus: [] };
    } else {
      if (nestedMenuItems[item.parent_id]) {
        nestedMenuItems[item.parent_id].submenus.push(item);
      }
    }
    // console.log(nestedMenuItems);
  });

  const [openKeys, setOpenKeys] = useState([]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div>
      <Menu
        className="menu"
        style={{
          maxHeight: "calc(85vh - 25px)",
          height: "calc(100vh - 64px)", // Set a fixed height
          overflowY: "auto",
          top: 30,
          background: "#E5E5E5",
        }}
        defaultSelectedKeys={["1"]}
        mode="inline"
        theme="light"
        inlineCollapsed={menuCollapsed}
        onClick={({ id }) => handleMenuClick(id)}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
      >
        {Object.values(nestedMenuItems).map((menuItem) =>
        menuItem.submenus.length > 0 ? (
          <Menu.SubMenu
            key={menuItem.id}
            icon={
              menuItem.icon
                ? React.createElement(iconComponents[menuItem.icon])
                : null
            }
            title={menuItem.label}
          >
            {menuItem.submenus.map((submenu) => (
              <Menu.Item
                key={submenu.id}
                icon={
                  submenu.icon
                    ? React.createElement(iconComponents[submenu.icon])
                    : null
                }
              >
                {submenu.label}
                <Link to={submenu.route}></Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            key={menuItem.id}
            icon={
              menuItem.icon
                ? React.createElement(iconComponents[menuItem.icon])
                : null
            }
          >
            {menuItem.label}
            <Link to={menuItem.route}></Link>
          </Menu.Item>
        )
      )}
      </Menu>

      <Button
        // type="primary"
        onClick={toggleCollapsed}
        style={{
          // marginBottom: 10,
          textAlign: "center",
          position: "fixed",

          // right: menuCollapsed ? 7 : 100,
          background: "white",
          border: "none",
          transition: "left 0.3s ease",
          borderRadius: "90%",
          padding: "0%",
          left: menuCollapsed ? 75 : 190,
          top: 90,
          zIndex: 1,
          fontSize: "24px",
          color: "Gray",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {menuCollapsed ? <RightCircleOutlined /> : <LeftCircleOutlined />}
      </Button>
    </div>
  );
};

export default Sidebar;
