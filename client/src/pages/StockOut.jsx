import React, { useContext, useEffect, useState } from "react";
import { Card, InputNumber, Table } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import { TeamContext } from "../context/TeamContext";
import "../pages/Login.css";
import { CloseOutlined } from "@ant-design/icons";
const api_address = process.env.REACT_APP_API_ADDRESS;
function StockOut() {
  // const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { teamId, setTeamId, changeTeam } = useContext(TeamContext);
  const [items, setItems] = useState([]);
  const MyVerticallyCenteredModal = (props) => (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Are you sure ?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Do you really want to update the quantity ?</h6>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleUpdateClick}>Update</button>
        <button onClick={props.onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
  useEffect(() => {
    const storedTeamId = localStorage.getItem("selectedTeamId");
    if (storedTeamId) {
      changeTeam(storedTeamId); // use changeTeam to update context
    }
  }, [changeTeam]);

  useEffect(() => {
    if (teamId) {
      axios
        .get(`${api_address}/products?team_id=${teamId}`)
        .then((res) => {
          if (res.data.success === true) {
            setAuth(true);
            const sortedInventory = res.data.items.sort((a, b) =>
              a.product_name.localeCompare(b.product_name)
            );
            setItems(res.data.items);
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
    axios.defaults.withCredentials = true;
    axios
      .get(`${api_address}/products`)
      .then((res) => {
        // console.log(res.data)

        if (res.data.success === true) {
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
        console.log(err.response.data); // Log the error response data
        console.error(err); // Log the full error object for further investigation
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
    selectedItems.forEach((item) => {
      const existingItem = data.find((i) => i.product_id === item.product_id);
      const inventoryQuantity = existingItem ? existingItem.quantity : 0;
      axios
        .put(`${api_address}/products/updateQuantity`, {
          productId: item.product_id,
          quantity: inventoryQuantity - item.quantity,
        })
        .then((res) => {
          console.log("Quantity updated successfully");
          setShowToast(true); // Show the toast message
        })
        .catch((err) => {
          console.error("Failed to update quantity:", err);
        });
    });
    window.location.href = window.location.href;
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

  const handleCloseRow = (productId) => {
    setSelectedItems(
      selectedItems.filter((item) => item.product_id !== productId)
    );
  };

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
          <h2 style={{ marginBottom: 30 }}>Stock Out</h2>
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
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={data.filter(
                  (inventory) => inventory.team_id === parseInt(teamId)
                )}
                onRow={onRowClick}
                rowKey="product_id"
                pagination={{ pageSize: 10 }}
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
                  Remove Quantity:
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
                          style={{
                            fontWeight: "bold",
                            border: "3px black solid",
                            marginRight: "10px",
                          }}
                        />

                        <CloseOutlined
                          onClick={() => handleCloseRow(item.product_id)}
                          style={{ color: "Black", cursor: "pointer" }}
                        />
                      </div>
                      {/* <p style={{ marginBottom: 0 }}>Latest Quantity: {inventoryQuantity + item.quantity}</p> */}
                    </div>
                  );
                })}

                <center style={{ paddingTop: "20px" }}>
                  <button
                    style={{ borderRadius: "50px" }}
                    onClick={() => setModalShow(true)}
                  >
                    Update
                  </button>
                  <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
                </center>
              </div>
            ) : (
              <div
                style={{
                  padding: "24px",
                  paddingTop: "103px",
                  color: "#ccc",
                  textAlign: "center",
                }}
              >
                To view inventory details,
                <br /> you can group items by attribute or <br />
                select them individually from the list on the left.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StockOut;
