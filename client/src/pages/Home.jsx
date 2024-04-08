import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import { Table } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu, Card } from "antd";

const items = [
  { key: "1", label: "Item List", icon: <PieChartOutlined />, route: "/" },
  { key: "2", label: "Stock In", icon: <DesktopOutlined />, route: "/stockin" },
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

export const Home = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [chartData, setChartData] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [collapsed, setCollapsed] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.Status === "success") {
          setAuth(true);
          setName(res.data.name);
          const sortedInventory = res.data.inventory.sort((a, b) =>
            a.product_name.localeCompare(b.product_name)
          );
          setData(sortedInventory);
          setFilteredData(sortedInventory); // Set filteredData to sortedInventory
          // generateChartData(sortedInventory);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:8082/logout")
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8082/delete/" + id)
      .then((res) => {
        const updatedData = data.filter(
          (inventory) => inventory.product_id !== id
        );
        setData(updatedData);
        setFilteredData(updatedData);
        // generateChartData(updatedData);
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    if (category === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.category === category);
      setFilteredData(filtered);
    }
  };

  const toggleCollapsed = () => {
    // setCollapsed(!collapsed);
    setMenuCollapsed(!menuCollapsed);
  };
  const { SubMenu } = Menu;
  const navigate = useNavigate();

  return (
    <div>
      <div className="container mt-4">
        {auth ? (
          <>
            <div style={{ display: "flex" }}>
              <div>
                <Button
                  type="primary"
                  onClick={toggleCollapsed}
                  style={{ marginBottom: 10 }}
                >
                  {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>

                <Menu
                  style={{ maxHeight: "calc(73vh - 64px)", overflowY: "auto" }}
                  defaultSelectedKeys={["1"]}
                  defaultOpenKeys={["sub1"]}
                  mode="inline"
                  theme="light"
                  inlineCollapsed={menuCollapsed}
                  // overflowedIndicator={<div style={{ color: 'red' }}>More</div>}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 20,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <h2>Item List</h2>
                  <Button href="/create" type="primary">
                    + Add Item
                  </Button>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Card style={{ width: "48%" }}>
                    <div className="table-responsive">
                      <Table hover responsive>
                        <tbody>
                          {filteredData.map((inventory, index) => (
                            <tr key={index}>
                              <td>{inventory.product_name}</td>

                              <td>{inventory.quantity}</td>

                              <td>
                                <div className="d-flex justify-content-between align-items-center">
                                  <Link
                                    to={`/read/${inventory.product_id}`}
                                    className="btn btn-sm btn-info mr-2"
                                  >
                                    Read
                                  </Link>
                                  <Link
                                    to={`/edit/${inventory.product_id}`}
                                    className="btn btn-sm btn-primary mr-2"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() =>
                                      handleDelete(inventory.product_id)
                                    }
                                    className="btn btn-sm btn-danger"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card>
                  <Card style={{ width: "48%" }}>Second Card </Card>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h3>{message}</h3>
            <h3>Login Now</h3>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
