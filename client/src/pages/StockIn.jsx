import React, { useEffect, useState } from "react";
import {  Card, InputNumber,Alert } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';

function StockIn() {
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
        <Button type="primary" onClick={handleUpdateClick}>Update</Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
    

    useEffect(() => {
        axios.defaults.withCredentials = true;
        axios
          .get("http://localhost:8082/products")
          .then((res) => {
            console.log(res.data)
            
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
      selectedItems.forEach(item => {
        const existingItem = data.find(i => i.product_id === item.product_id);
        const inventoryQuantity = existingItem ? existingItem.quantity : 0;
        axios.put('http://localhost:8082/products/updateQuantity', { productId: item.product_id, quantity: inventoryQuantity + item.quantity })
            .then(res => {
                console.log('Quantity updated successfully');
                
            })
            .catch(err => {
                console.error('Failed to update quantity:', err);
            });
      });
      window.location.href = window.location.href;

  };


    

    return (
      <div>
      <div className="container mt-4">
        {auth ?(
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxHeight: "calc(40vh - 34px)",
          }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                height: "50px"
              }}
            >
              <h2>Stock In</h2>
              
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Card className="mb-3" style={{ width: "100%", border: "none",  height: "calc(77vh - 64px)", overflowY: "auto" }}>
                <div className="table-responsive">
                  <table>
                    <tbody>
                      {filteredData.map((inventory, index) => (
                        <tr key={index} onClick={() => handleItemClick(inventory)} style={{ cursor: "pointer" }}>
                          <td>{inventory.product_name}</td>
                          <td>{inventory.quantity}</td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card className="mb-3" style={{ width: "100%", border: "none", height: "calc(77vh - 64px)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {selectedItems.length > 0 ? (
  <div style={{ padding: "24px", color: "black" }}>
    <h5>Add Quantity:</h5>
    <br/>
    {selectedItems.map(item => {
      const existingItem = data.find(i => i.product_id === item.product_id);
      const inventoryQuantity = existingItem ? existingItem.quantity : 0;
      return (
        <div key={item.product_id} style={{display: "flex",alignItems: "center",padding:10,justifyContent: "space-between" }}>
          <p style={{ marginBottom: "8px", fontWeight: "bold" }}>{item.product_name}</p>
          
            <InputNumber
              min={1}
              value={item.quantity}
              onChange={(value) => handleQuantityChange(item.product_id, value)}
              style={{border:'none' }}
            />
            {/* <p style={{ marginBottom: 0 }}>Latest Quantity: {inventoryQuantity + item.quantity}</p> */}
          
        </div>
      );
    })}
    
  </div>
) : (
  <div style={{ padding: "24px", paddingTop: "103px", color: "#ccc", textAlign: "center" }}>
    To view inventory details,<br/> you can group items
    by attribute or <br/>select them individually from the list on the left.
  </div>
)}
</Card>

            </div>
            
            <br />
            <div>
              <Button type="primary" onClick={() => setModalShow(true)}>Update</Button>
              <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
              </div>
              <br />
          </div>
        ) : (
          <div>
            <h3>{message}</h3>
            <h3>Login Now</h3>
            <Link to="/login" className="btn btn-primary">
              hello
            </Link>
          </div>
        )}
      </div>
      <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide style={{ position: 'absolute', top: 20, right: 20 }}>
        <Toast.Header>
          <strong className="me-auto">Inventory Management</strong>
        </Toast.Header>
        <Toast.Body>Product quantity updated successfully</Toast.Body>
      </Toast>
    </div>

    )
}

export default StockIn;
