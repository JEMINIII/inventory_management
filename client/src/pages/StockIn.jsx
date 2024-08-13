import React, { useContext, useEffect, useState } from "react";
import { Card, Input, Table, Pagination,InputNumber } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import { TeamContext } from "../context/TeamContext";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

function StockIn() {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { teamId, setTeamId } = useContext(TeamContext);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);

  useEffect(() => {
    const storedTeamId = localStorage.getItem("selectedTeamId");
    if (storedTeamId) {
      setTeamId(storedTeamId);
    }
  }, [setTeamId]);

  useEffect(() => {
    if (teamId) {
      axios
        .get(`http://localhost:8082/products?team_id=${teamId}`)
        .then((res) => {
          if (res.data.success) {
            setAuth(true);
            const sortedInventory = res.data.items.sort((a, b) =>
              a.product_name.localeCompare(b.product_name)
            );
            setData(sortedInventory);
            setFilteredData(sortedInventory);
          } else {
            setAuth(false);
            setMessage(res.data.error);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [teamId]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8082/products")
      .then((res) => {
        if (res.data.success) {
          setAuth(true);
          const sortedInventory = res.data.items.sort((a, b) =>
            a.product_name.localeCompare(b.product_name)
          );
          setData(sortedInventory);
          setFilteredData(sortedInventory);
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleItemClick = (inventory) => {
    const existingItemIndex = selectedItems.findIndex(
      (item) => item.product_id === inventory.product_id
    );
    if (existingItemIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity++;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { ...inventory, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const updatedItems = selectedItems.map((item) =>
      item.product_id === productId ? { ...item, quantity } : item
    );
    setSelectedItems(updatedItems);
  };

  const handleUpdateClick = () => {
    // Create a new array to hold the updated items
    const updatedItems = [...selectedItems];
  
    // Iterate over each selected item
    selectedItems.forEach((item) => {
      const existingItem = data.find((i) => i.product_id === item.product_id);
      const inventoryQuantity = existingItem ? existingItem.quantity : 0;
  
      // Update the item quantity in the backend
      axios
        .put("http://localhost:8082/products/updateQuantity", {
          productId: item.product_id,
          quantity: inventoryQuantity + item.quantity,
        })
        .then(() => {
          console.log("Quantity updated successfully");
          
          // Update the local state with the new quantity
          setData((prevData) =>
            prevData.map((i) =>
              i.product_id === item.product_id
                ? { ...i, quantity: inventoryQuantity + item.quantity }
                : i
            )
          );
  
          // Optionally update filteredData if necessary
          setFilteredData((prevFilteredData) =>
            prevFilteredData.map((i) =>
              i.product_id === item.product_id
                ? { ...i, quantity: inventoryQuantity + item.quantity }
                : i
            )
          );
        })
        .catch((err) => {
          console.error("Failed to update quantity:", err);
        });
    });
  
    // Reset selected items
    setSelectedItems([]);
  
    // Show toast notification
    setShowToast(true);
  };
  

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 800);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const columns = [
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  const onRowClick = (record) => {
    return {
      onClick: () => handleItemClick(record), // Handle click on row
    };
  };

  const handleCloseRow = (productId) => {
    setSelectedItems(
      selectedItems.filter((item) => item.product_id !== productId)
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxHeight: "calc(80vh - 74px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            marginTop: 30,
            borderBottom: "2px black solid",
          }}
        >
          <h2 style={{ marginBottom: 30 }}>Stock In</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          <Card
            className="mb-3"
            style={{
              width: "100%",
              padding: "10px",
              textAlign: "left",
              overflowY: "auto",
            }}
          >

            <div style={{ textAlign: "left", marginBottom: 20 }}>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                prefix={<SearchOutlined />} 
              />
            </div>

            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={filteredData.filter(
                  (inventory) => inventory.team_id === parseInt(teamId)
                )}
                onRow={onRowClick}
                rowKey="product_id"
                pagination={{ pageSize: 5 }}
              />
            </div>

            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <Toast.Header>
                <strong className="me-auto">Inventory Management</strong>
              </Toast.Header>
              <Toast.Body>Product quantity updated successfully</Toast.Body>
            </Toast>
          </Card>
          <Card
            className="mb-3"
            style={{
              padding: "10px",
              width: "100%",
              height: "calc(73vh - 64px)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {selectedItems.length > 0 ? (
              <div style={{ color: "black" }}>
                <h6
                  style={{
                    borderBottom: "3px black solid",
                    paddingBottom: "5px",
                  }}
                >
                  Add Quantity:
                </h6>

                {selectedItems.map((item) => {
                  const existingItem = data.find(
                    (i) => i.product_id === item.product_id
                  );
                  const inventoryQuantity = existingItem
                    ? existingItem.quantity
                    : 0;
                  return (
                    <div
                      key={item.product_id}
                      style={{
                        backgroundColor: "#ebebeb",
                        display: "flex",
                        alignItems: "center",
                        padding: 10,
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ marginBottom: "8px", fontWeight: "bold" }}>
                        {item.product_name}
                      </p>
                      <div>
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) =>
                            handleQuantityChange(item.product_id, value)
                          }
                        />
                        <button
                          onClick={() => handleCloseRow(item.product_id)}
                          style={{ marginLeft: 10 }}
                        >
                          <CloseOutlined />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={handleUpdateClick}
                  style={{
                    border: "none",
                    backgroundColor: "#006400",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    marginTop: "10px",
                  }}
                >
                  Update
                </button>
              </div>
            ) : (
              <div>No items selected</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StockIn;
