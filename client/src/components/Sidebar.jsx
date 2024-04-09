import React,{useState} from 'react'
import { Link, useNavigate } from "react-router-dom";
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    LeftSquareOutlined,
    RightSquareOutlined
  } from "@ant-design/icons";
  import { Button, Menu, Card } from "antd";
  const items = [
    { key: "1", label: "Item List", icon: <PieChartOutlined />, route: "/" },
    { key: "2", label: "Stock In", icon: <DesktopOutlined />, route: "/create" },
    {
      key: "3",
      label: "Stock Out",
      icon: <ContainerOutlined />,
      route: "/stockout",
    },
    { key: "4", label: "Adjust", icon: <ContainerOutlined /> },
    { key: "5", label: "Transaction", icon: <ContainerOutlined /> },
    {
      key: "sub1",
      label: "Purchase & Sales",
      icon: <MailOutlined />,
      items: [
        { key: "6", label: "Bundles" },
        { key: "7", label: "Purchases" },
        { key: "8", label: "Sales" },
        { key: "9", label: "Salses Analysis" },
      ],
    },
    {
      key: "sub2",
      label: "Print Barcode",
      icon: <MailOutlined />,
      items: [
        { key: "10", label: "Item" },
        { key: "11", label: "Bundle" },
      ],
    },
    {
      key: "sub3",
      label: "Other Features",
      icon: <MailOutlined />,
      items: [
        { key: "12", label: "Low Stock Alert" },
        { key: "13", label: "Past Quantity" },
        { key: "14", label: "Inventory Link" },
        { key: "15", label: "Inventory Count" },
      ],
    },
    {
      key: "sub4",
      label: "Reports",
      icon: <AppstoreOutlined />,
      items: [
        { key: "16", label: "Summary" },
        { key: "17", label: "Dashboard" },
        { key: "18", label: "Analytics" },
      ],
    },
    {
      key: "sub5",
      label: "Data Center",
      icon: <AppstoreOutlined />,
      items: [
        { key: "19", label: "Item" },
        { key: "20", label: "Attribute" },
        { key: "21", label: "Partners" },
      ],
    },
    {
      key: "sub6",
      label: "Settings",
      icon: <AppstoreOutlined />,
      items: [
        { key: "22", label: "User" },
        { key: "23", label: "Team" },
        { key: "24", label: "Members" },
        { key: "25", label: "Integration & API" },
        { key: "26", label: "Billing" },
      ],
    },
  ];

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
    
      const handleMenuClick = (key) => {
        setSelectedMenuItem(key);
      };

  return (
    <div style={{ display: "flex" }}>
      
    <div >
                

                <Menu
                  style={{ maxHeight: "calc(71vh - 64px)", overflowY: "auto" ,top:30}}
                  defaultSelectedKeys={["1"]}
                //   defaultOpenKeys={["sub1"]}
                  mode="inline"
                  theme="light"
                  inlineCollapsed={menuCollapsed}
                  onClick={({ key }) => handleMenuClick(key)}
                >
                  {items.map((item) =>
                    item.items ? (
                      <SubMenu
                        key={item.key}
                        icon={item.icon}
                        title={item.label}
                      >
                        {item.items.map((subItem) => (
                          <Menu.Item key={subItem.key}>
                            {subItem.label}
                          </Menu.Item>
                        ))}
                      </SubMenu>
                    ) : (
                      <Menu.Item key={item.key} icon={item.icon}>
                        {item.label}
                        <Link to={item.route}></Link>
                      </Menu.Item>
                    )
                  )}
                </Menu>
              </div>
              <Button
                  // type="primary"
                  onClick={toggleCollapsed}
                  style={{
            // marginBottom: 10,
            textAlign:'center',
            // position: "absolute",
            top:200,
            // right: menuCollapsed ? 0 : -40,
            background:"transparent",
            border:"none",
            transition: "left 0.3s ease",
            // borderRadius:'50%',
            left:-20,
            zIndex: 1,
            fontSize: "24px",
            display: "flex", // Use flexbox
            alignItems: "center", // Align items vertically
            justifyContent: "center", 
          }}
                >
                  {menuCollapsed ? <RightSquareOutlined /> : <LeftSquareOutlined />}
                </Button>
              </div>
  )
}

export default Sidebar