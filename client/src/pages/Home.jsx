import React, {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  Card,
  Menu,
} from 'antd';
import axios from 'axios';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

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
//       { key: "9", label: "Salses Analysis" },
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

export const Home = () => {
  const [data, setData] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  // const [chartData, setChartData] = useState(null);
  // const [show, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  // const [collapsed, setCollapsed] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]); 

  useEffect(() => {
    const filtered = data.filter(item =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);
  

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8082/products/getAlItems")
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
    <div>
      <div className="container mt-4">
        {auth ? (
          <>
              <div style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  maxHeight: "calc(80vh - 64px)",
                }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    height: "calc(100vh - 64px)"
                  }}
                >
                  <h2>Item List</h2>
                  
                  
                  
                  <Button href="/create">
                    + Add Item
                  </Button>
                </div>
                
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  
                  <Card className="mb-3" style={{ width: "100%", border: "none",  height: "calc(77vh - 64px)", overflowY: "auto" }}>
                    <div className="table-responsive">
                    <table>
                    <tbody>
                      {filteredData.map((inventory, index) => (
                        <tr key={index} onClick={() => navigate(`/read/${inventory.product_id}`)} style={{ cursor: "pointer" }}>
                          <td>
                              {inventory.product_name}
                          </td>
                          <td>{inventory.quantity}</td>
                          {/* Add other columns as needed */}
                        </tr>
                      ))}
                    </tbody>
                </table>
                    </div>
                  </Card>

                  <Card className="mb-3" style={{ width: "100%", border: "none", height: "calc(77vh - 64px)", overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ padding: "24px",paddingTop:'103px', color: "#ccc", textAlign: "center" }}>
                      To view inventory details,<br/> you can group items
                      by attribute or <br/>select them individually from the list on the left.
                    </div>
                  </Card>


                </div>
              </div>
            {/* </div> */}
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
