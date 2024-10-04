import React, { useContext, useEffect, useState } from "react";
import { Card, InputNumber, Table, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { CloseOutlined } from '@ant-design/icons';
import { TeamContext } from "../context/TeamContext";
import '../pages/Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import { SearchOutlined } from '@ant-design/icons';

const api_address = process.env.REACT_APP_API_ADDRESS;

function StockIn() {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const { teamId, setTeamId } = useContext(TeamContext);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
  const [searchQuery, setSearchQuery] = useState("");
   const MyVerticallyCenteredModal = ({ handleUpdateClick, ...props }) => (
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
          <button type="primary" onClick={handleUpdateClick}>
            Yes
          </button>
          <button onClick={props.onHide}>No</button>
        </Modal.Footer>
      </Modal>
    );

  useEffect(() => {
    const storedTeamId = localStorage.getItem("selectedTeamId");
    if (storedTeamId) {
      setTeamId(storedTeamId);
    }
  }, [setTeamId]);

  useEffect(() => {
    if (teamId) {
      axios.get(`${api_address}/products?team_id=${teamId}`)
        .then((res) => {
          if (res.data.success === true) {
            setAuth(true);
            const sortedInventory = Array.isArray(res.data.items)
              ? res.data.items.sort((a, b) => a.product_name.localeCompare(b.product_name))
              : [];
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
    axios.get(`${api_address}/products`, { withCredentials: true })
      .then((res) => {
        if (res.data.success === true) {
          setAuth(true);
          const sortedInventory = Array.isArray(res.data.items)
            ? res.data.items.sort((a, b) => a.product_name.localeCompare(b.product_name))
            : [];
          setData(sortedInventory);
          setFilteredData(sortedInventory);
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      })
      .catch((err) => {
        console.error(err.response?.data || err);
      });
  }, []);
  

  const handleItemClick = (inventory) => {
    const existingItemIndex = selectedItems.findIndex(item => item.product_id === inventory.product_id);
    if (existingItemIndex !== -1) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity++;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { ...inventory, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const updatedItems = selectedItems.map(item =>
      item.product_id === productId ? { ...item, quantity } : item
    );
    setSelectedItems(updatedItems);
  };

  const handleUpdateClick = () => {
    const updateRequests = selectedItems.map(item => {
      const existingItem = Array.isArray(data) ? data.find(i => i.product_id === item.product_id) : null;
      const inventoryQuantity = existingItem ? existingItem.quantity : 0;
  
      return axios.put(
        `${api_address}/products/updateQuantity`, 
        { productId: item.product_id, quantity: inventoryQuantity + item.quantity },
        { withCredentials: true } // Ensure withCredentials is explicitly set
      );
    });
  
    Promise.all(updateRequests)
      .then(() => {
        console.log('Quantity updated successfully');
        toast.success('Product quantity updated successfully');
        setModalShow(false); // Close the modal
        fetchUpdatedData(); // Refresh data
        setSelectedItems([]); // Clear selected items
      })
      .catch(err => {
        console.error('Failed to update quantity:', err);
        toast.error('Failed to update product quantities');
      });
  };
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = data.filter(item => 
        item.product_name.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const fetchUpdatedData = () => {
    axios.get(`${api_address}/products`)
      .then(res => {
        if (res.data.success === true && Array.isArray(res.data.items)) {
          setData(res.data.items);
          setFilteredData(res.data.items);
        } else {
          console.error('Failed to fetch updated data:', res.data.error);
        }
      })
      .catch(err => {
        console.error('Failed to fetch updated data:', err);
      });
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
      <ToastContainer />
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxHeight: "calc(80vh - 74px)",
      }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            marginTop: 30,
            borderBottom: "2px black solid"
          }}
        >
          <h2 style={{ marginBottom: 30 }}>Stock In</h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: isSmallScreen ? "column" : "row"
          }}
        >
          <Card className="mb-3" style={{ width: "100%", padding: '10px', textAlign: 'left', overflowY: "auto" }}>
          <div style={{ textAlign: "left" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                prefix={<SearchOutlined />} 
              />
            </div>
            <Table
              columns={columns}
              dataSource={filteredData.filter(
                (inventory) => inventory.team_id === parseInt(teamId)
              )}
              onRow={onRowClick}
              rowKey="product_id"
              pagination={{ pageSize: 8 }}
            />
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
                  const existingItem = Array.isArray(data) ? data.find(
                    (i) => i.product_id === item.product_id
                  ) : null;
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
                    </div>
                  );
                })}
                <button
                  type="primary"
                  onClick={() => setModalShow(true)}
                  style={{ marginTop: 20 }}
                >
                  Update Quantities
                </button>
                <MyVerticallyCenteredModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  handleUpdateClick={handleUpdateClick}
                />
              </div>
            ) : (
              <p>No items selected</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StockIn;
