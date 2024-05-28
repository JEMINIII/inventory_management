import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate,useParams } from "react-router-dom";
import { Button, Card } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { notification } from 'antd';
import Modal from 'react-bootstrap/Modal';



export const Home = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [editedItem, setEditedItem] = useState(null);
    const [showModal, setShowModal] = useState(false); 
  const [modalShow, setModalShow] = useState(false);
  const [teamId, setTeamId] = useState(null); 
  console.log(teamId)
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
        <h6>Do you really want to Delete the Product ?</h6>
        
      </Modal.Body>
      <Modal.Footer>
      <Button type="primary" onClick={deleteItem}>Delete</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);


  useEffect(() => {
    const storedTeamId = localStorage.getItem("teamId");
    if (storedTeamId) {
      setTeamId(parseInt(storedTeamId));
    }
  }, []);

  useEffect(() => {
    if (teamId) {
      axios.defaults.withCredentials = true;
      axios
        .get(`http://localhost:8082/products?team_id=${teamId}`)
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
          console.log(err.response.data);
          console.error(err);
        });
    }
  }, [teamId]);


  const handleTeamChange = (e) => {
    setTeamId(e.target.value);
    
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
        console.log(err.response.data); 
        console.error(err); 
      });
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);


  // const handleDelete = (id) => {
  //   axios
  //     .delete(`http://localhost:8082/products/delete/${selectedItem.product_id}`)
  //     .then(() => {
  //       const updatedData = data.filter(
  //         (inventory) => inventory.product_id !== id
  //       );
  //       setData(updatedData);
  //       setSelectedItem(null); 
  //       window.location.reload();   
  //       toast.success("Item deleted successfully"); // Show success toast
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error("Failed to delete item"); // Show error toast
  //     });
  // };

  // const handleDelete = (id) => {
  //   setShowModal(true);
  //   setSelectedItem(id);
  // };



  // const handleDelete = (id) => {
  //   const key = `open${Date.now()}`;
  //   notification.open({
  //     message: 'product successfully deleted',
  //     key
  //   });
  // };

const deleteItem = (id) => {
  axios
    .delete(`http://localhost:8082/products/delete/${selectedItem.product_id}`)
    .then(() => {
      const updatedData = data.filter(
        (inventory) => inventory.product_id !== id
      );
      setData(updatedData);
      setSelectedItem(null); 
      const key = `open${Date.now()}`;
    notification.open({
      message: 'product successfully deleted',
      key
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000); 
  
    })
    .catch((err) => console.log(err));
};


  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:8082/products/delete/${selectedItem.product_id}`)
      .then(() => {
        const updatedData = data.filter(
          (inventory) => inventory.product_id !== selectedItem.product_id
        );
        setData(updatedData);
        setSelectedItem(null);
        setShowModal(false);
        window.location.reload();
        toast.success("Item deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to delete item");
      });
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };





  const handleItemClick = (inventory) => {
    setSelectedItem(inventory);
    setEditedItem({ ...inventory }); 
    setIsEditing(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8082/products/edit/${selectedItem.product_id}`, editedItem)
      .then(() => {
        const updatedData = data.map((item) =>
          item.product_id === selectedItem.product_id ? editedItem : item
        );
        setData(updatedData);
        setSelectedItem(editedItem);
        setIsEditing(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <select onChange={handleTeamChange}>
        <option value="">Select Team</option>
        <option value="1">Team 1</option>
        <option value="2">Team 2</option>
        
      </select>
      <ToastContainer />
      <div className="container mt-4">
        {auth ? (
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
                height: "calc(100vh - 64px)",
                borderBottom: "2px skyblue solid"
              }}
            >
              <h2>Item List</h2>
              <Button href="/create">+ Add Item</Button>
            </div>
           <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isSmallScreen ? "column" : "row"
        }}
      >
              <Card className="mb-3" style={{ width: "100%",padding:'10px',textAlign:'left',  height: "calc(73vh - 64px)", overflowY: "auto" }}>
                
                <div className="table-responsive">
                  
                  <table>
                    <thead style={{borderBottom:"3px skyblue solid"}}>
                    <th>Product</th>
                    <th>Quantity</th>
                    </thead>
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
              <Card className="mb-3" style={{ padding: '10px', width: "100%", height: "calc(73vh - 64px)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
  {selectedItem ? (
    <div style={{ color: "black", justifyContent: 'center' }}>
      {isEditing ? (
        <>
          <h6 style={{ borderBottom: "3px skyblue solid", paddingBottom: '5px' }}>Edit Item</h6>
          <div style={{ display: 'flex', textAlign:'left',padding:'10px',flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <table>
            <tbody>
              <tr>
                <td><label><strong>Product Name:</strong></label></td>
                <td><input type="text" style={{border:'none'}} name="product_name" value={editedItem.product_name} onChange={handleEditChange} /></td>
              </tr>
              <tr>
                <td><label><strong>Category:</strong></label></td>
                <td><input type="text"style={{border:'none'}} name="category" value={editedItem.category} onChange={handleEditChange} /></td>
              </tr>
              <tr>
                <td><label><strong>Quantity:</strong></label></td>
                <td><input type="text"style={{border:'none'}} name="quantity" value={editedItem.quantity} onChange={handleEditChange} /></td>
              </tr>
              <tr>
                <td><label><strong>Price:</strong></label></td>
                <td><input type="text"style={{border:'none'}} name="price" value={editedItem.price} onChange={handleEditChange} /></td>
              </tr>
              <tr>
                <td><label><strong>Total Amount:</strong></label></td>
                <td><input type="text"style={{border:'none'}} name="total_amount" value={editedItem.total_amount} onChange={handleEditChange} /></td>
              </tr>
            </tbody>
          </table>

          <div style={{ padding:'24p',textAlign: 'center' }}>
            <Button onClick={handleUpdate}>Save</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
          
        </>
      ) : (
        <>
          <h6 style={{ borderBottom: "3px skyblue solid", paddingBottom: '5px' }}>Selected Item Details</h6>
          <div style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <div>{selectedItem.product_name}</div>
            <div style={{ textAlign: 'center', marginTop: '10px',display:"flex" }}>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button onClick={() => setModalShow(true)}>Delete</Button>
              <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
            </div>
              
          </div>

          <br />
          
          <table>
          {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this item?</p>
            <div className="modal-actions">
              <Button onClick={handleConfirmDelete}>Yes</Button>
              <Button onClick={handleCancelDelete}>No</Button>
            </div>
          </div>
        </div>
      )}
            <tbody>
              <tr>
                <td><strong>ProductId</strong> </td>
                <td>{selectedItem.product_id}</td>
              </tr>
              <tr>
                <td><strong>Category</strong></td>
                <td>{selectedItem.category}</td>
              </tr>
              <tr>
                <td><strong>Price</strong></td>
                <td>{selectedItem.price}</td>
              </tr>
              <tr>
                <td><strong>Quantity</strong></td>
                <td>{selectedItem.quantity}</td>
              </tr>
              <tr>
                <td><strong>Total Amount</strong> </td>
                <td>{selectedItem.total_amount}</td>
              </tr>
              <tr>
                <td><strong>Image</strong></td>
                <td>
                  {selectedItem.img && (
                    <img
                      src={`http://localhost:8082/images/${selectedItem.img}`}
                      alt={selectedItem.product_name}
                      style={{ maxWidth: "40%", height: "auto", marginTop: "10px" }}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  ) : (
    <div style={{ padding: "24px", paddingTop: "103px", color: "#ccc", textAlign: "center" }}>
      Click on an item to view its details.
    </div>
  )}
</Card>
            </div>
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
    </div>
  );
};


