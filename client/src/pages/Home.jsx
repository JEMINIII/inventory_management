import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Table,Button, Card } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { notification } from 'antd';
import Modal from 'react-bootstrap/Modal';
// import TeamSelector from "../components/TeamSelector";
import { TeamContext } from "../context/TeamContext";

export const Home = () => {
  const [formValues, setFormValues] = useState({
    product_name: "",
    category: "",
    price: "",
    quantity: "",
    total_amount: "",
    team_id: "",
    user_id: '',
    product_id: null,
  });

  // const { teamId, changeTeam } = useContext(TeamContext);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8082/team')
      .then((response) => {
        if (response.data.success) {
          setTeams(response.data.items);
        } else {
          console.error("Failed to fetch teams");
        }
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  const handleTeamChange = (e) => {
    const selectedTeamId = e.target.value;
    setTeamId(selectedTeamId);
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      team_id: selectedTeamId,
    }));
  };
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
  // const [teamId, setTeamId] = useState(localStorage.getItem("teamId") || ""); 
  const { teamId, setTeamId } = useContext(TeamContext);
  const [items, setItems] = useState([]);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const MyVerticallyCenteredModal = (props) => (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6>Do you really want to Delete the Product?</h6>
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
    const storedTeamId = localStorage.getItem("selectedTeamId");
    if (storedTeamId) {
        setTeamId(storedTeamId);
    }
}, [setTeamId]);

useEffect(() => {
  if (teamId) {
    axios.get(`http://localhost:8082/products?team_id=${teamId}`)
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

const handleCreateInputChange = (e) => {
  const { name, value } = e.target;
  setFormValues({
    ...formValues,
    [name]: value,
    total_amount: name === 'price' || name === 'quantity' ? calculateTotalAmount(value) : formValues.total_amount
  });
};

const calculateTotalAmount = (value) => {
  const price = parseFloat(formValues.price) || 0;
  const quantity = parseFloat(formValues.quantity) || 0;
  const newValue = parseFloat(value) || 0;
  if (isNaN(price) || isNaN(quantity) || isNaN(newValue)) {
    return formValues.total_amount;
  }
  return (quantity * price).toFixed(2);
};

const handleCreateSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  console.log('Values:', formValues);

  formData.append("product_name", formValues.product_name);
  formData.append("category", formValues.category);
  formData.append("price", formValues.price);
  formData.append("quantity", formValues.quantity);
  formData.append("total_amount", formValues.total_amount);
  formData.append("team_id", formValues.team_id);
  formData.append("image", formValues.image);

  for (var key of formData.entries()) {
    console.log(key[0] + ', ' + key[1]);
  }

  axios
    .post("http://localhost:8082/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "enctype":"multipart/form-data"
      }
    })
    .then((res) => {
      console.log(res);
      setCreateModalShow(false);
      navigate("/");
      // Reset form values after successful submission
      setFormValues({
        product_name: "",
        category: "",
        price: "",
        quantity: "",
        total_amount: "",
        team_id: "",
        user_id: '',
        product_id: null,
      });
    })
    .catch((err) => console.log(err));
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
        console.error(err);
      });
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);

    setFormValues({
      ...formValues,
      image: file
    });
  };


  

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

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
          message: 'Product successfully deleted',
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

  const { Column } = Table;
  return (
    <div>
      
      <ToastContainer />
      {/* <div className="container mt-3"> */}
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
              <Button onClick={() => setCreateModalShow(true)} style={{
                height: "30px",
                margin: "15px",
                backgroundColor: "skyblue",
                border: "none"
              }}>
                Add Item
              </Button>
            </div>
            {/* <TeamSelector teamId={teamId} setTeamId={setTeamId} /> */}
            <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isSmallScreen ? "column" : "row"
        }}
      >
              <Card className="mb-3" style={{ width: "100%",padding:'10px',textAlign:'left', overflowY: "auto" }}>
                
                <div className="table-responsive">
                  
                <Table dataSource={filteredData.filter((inventory) => inventory.team_id === parseInt(teamId))} rowKey="product_id"
                  pagination={{ pageSize: 5 }}>
                  <Column 
                    title="Product" 
                    dataIndex="product_name" 
                    key="product_name"  
                    />
                  <Column title="Quantity" dataIndex="quantity" key="quantity" />
                  <Column
                    // title="Action"
                    key="action"
                    render={(text, inventory, index) => (
                      <span onClick={() => handleItemClick(inventory)} style={{ cursor: "pointer" }}>
                        View
                      </span>
                    )}
                  />
                </Table>


                </div>
              </Card>
              <Card className="mb-3" style={{ padding: '10px', width: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
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
              <tr>
                <td><label><strong>Team Id:</strong></label></td>
                <td><input type="text"style={{border:'none'}} name="total_amount" value={editedItem.team_id} onChange={handleEditChange} /></td>
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
<Modal size='lg' show={createModalShow} onHide={() => setCreateModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateSubmit}>
            <div className="mb-3">
              <label htmlFor="product_name" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                className="form-control"
                id="product_name"
                name="product_name"
                value={formValues.product_name}
                onChange={handleCreateInputChange}
              />
              {formErrors.product_name && <p className="text-danger">{formErrors.product_name}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <input
                type="text"
                className="form-control"
                id="category"
                name="category"
                value={formValues.category}
                onChange={handleCreateInputChange}
              />
              {formErrors.category && <p className="text-danger">{formErrors.category}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                value={formValues.price}
                onChange={handleCreateInputChange}
              />
              {formErrors.price && <p className="text-danger">{formErrors.price}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Quantity
              </label>
              <input
                type="text"
                className="form-control"
                id="quantity"
                name="quantity"
                value={formValues.quantity}
                onChange={handleCreateInputChange}
              />
              {formErrors.quantity && <p className="text-danger">{formErrors.quantity}</p>}
            </div>
            <div className="mb-3">
              <label htmlFor="total_amount" className="form-label">
                Total Amount
              </label>
              <input
                type="text"
                className="form-control"
                id="total_amount"
                name="total_amount"
                value={formValues.total_amount}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="team_id" className="form-label">
                Team Id
              </label>
              <select
                className="form-control"
                value={teamId}
                onChange={handleTeamChange}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="form-control"
                id="team_id"
                name="team_id"
                value={formValues.team_id}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFile}
              />
            </div>
            <div className="mt-3">
                        <button style={{marginRight:'10px'}}className='btn btn-info'onClick={() => setCreateModalShow(false)}>Close</button>
                        <button className='btn btn-success'>Submit</button>
                    </div>
          </form>
        </Modal.Body>
      </Modal>
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
    // </div>
  );
};


