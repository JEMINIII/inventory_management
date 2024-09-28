import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Table, Input, Card } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { ToastContainer,toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";

const { Column } = Table;

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    client_name: '',
    city: '',
    state: '',
    mobile_number: '', // New field for mobile number
    org_id: '', // Will be set to current organization
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const api_address = process.env.REACT_APP_API_ADDRESS;

  
    const fetchClients = async () => {
        const token = localStorage.getItem('token');
        const orgId = localStorage.getItem('orgId');

        setFormValues(prevValues => ({
            ...prevValues,
            org_id: orgId,
        }));

        try {
            const res = await axios.get(`${api_address}/api/clients`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setClients(
                res.data.items.map(client => ({
                    client_name: client.client_name || '',
                    city: client.city || '',
                    state: client.state || '',
                    org_id: client.org_id || '',
                    mobile_number: client.mobile_number || '',
                    client_id: client.client_id,
                }))
            );
            console.log(res.data.items);
        } catch (error) {
            console.error('Error fetching clients:', error.response ? error.response.data : error.message);
        }
    };


    useEffect(() => {
    fetchClients();
  }, [api_address]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    axios.post(`${api_address}/api/clients/create`, formValues, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        fetchClients();
        setClients([...clients, response.data]);
        toast.success('Client created successfully!');
        setCreateModalShow(false);
        setFormValues({ client_name: '', city: '', state: '', org_id: '', mobile_number: '' });
      })
      .catch(error => {
        console.error('Error creating client:', error);
        toast.error('Error creating client!'); 
      });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedClient({ ...selectedClient, [name]: value });
  };

  const handleUpdate = () => {
    const token = localStorage.getItem('token');
    axios.put(`${api_address}/api/clients/edit/${selectedClient.client_id}`, selectedClient, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setClients(clients.map(client =>
          client.client_id === selectedClient.client_id ? selectedClient : client
        ));
        setIsEditing(false);
        setSelectedClient(null); // Clear selected client after updating
      })
      .catch(error => console.error('Error updating client:', error));
  };

  const handleDelete = (clientId) => {
    const token = localStorage.getItem('token');
    axios.delete(`${api_address}/api/clients/delete/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setClients(clients.filter(client => client.client_id !== clientId));
        setSelectedClient(null);
      })
      .catch(error => console.error('Error deleting client:', error));
  };

  const handleConfirmDelete = () => {
    if (selectedClient) {
      handleDelete(selectedClient.client_id);
      setModalShow(false);
    }
  };

  const handleCancelDelete = () => {
    setModalShow(false);
  };

  const filteredClients = clients.filter(client =>
    client.client_name && client.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <ToastContainer />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxHeight: "calc(98vh - 74px)",
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
          <h2 style={{ marginBottom: 30 }}>Client List</h2>
          <button type="primary" onClick={() => setCreateModalShow(true)} style={{ marginBottom: 30 }}>
            Add Client
          </button>
        </div>

        {/* Create Client Modal */}
        <Modal
          open={createModalShow}
          onCancel={() => setCreateModalShow(false)}
          centered
          footer={null}
        >
          <h3>Add Client</h3>
          <form onSubmit={handleCreateSubmit}>
            {Object.entries(formValues).map(([key, value]) => (
              <div className="form-group" key={key}>
                <label htmlFor={key} className="form-label">{key.replace(/_/g, " ").toUpperCase()}</label>
                <Input
                  placeholder={`Enter ${key.replace(/_/g, " ")}`}
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <center>
              <button type="primary" Type="submit">Submit</button>
            </center>
          </form>
        </Modal>

        {/* Search and Client List */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Card className="mb-3" style={{ width: "100%", padding: "10px", textAlign: "left", overflowY: "auto" }}>
            <div style={{ textAlign: "left", marginBottom: "15px" }}>
              <Input
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients..."
              />
            </div>

            {/* Table for displaying clients */}
            <Table
              dataSource={filteredClients}
              rowKey="client_id"
              pagination={{ pageSize: 8 }}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedClient(record);
                },
              })}
            >
              <Column title="Client Name" dataIndex="client_name" key="client_name" />
              <Column title="City" dataIndex="city" key="city" />
              <Column title="State" dataIndex="state" key="state" />
              <Column title="Mobile Number" dataIndex="mobile_number" key="mobile_number" /> {/* New Column */}
            </Table>
          </Card>

          {/* Selected Client Details */}
          <Card className="mb-3" style={{ padding: "10px", width: "100%", overflowY: "auto" }}>
            {selectedClient ? (
              <div style={{ color: "black", justifyContent: "center" }}>
                {isEditing ? (
                  <>
                    <div style={{ padding: "24px", display: "flex", justifyContent: "space-between" }}>
                      <h6 style={{ borderBottom: "3px black solid", paddingBottom: "5px" }}>Edit Client</h6>
                      <SaveOutlined style={{ fontSize: '20px' }} onClick={handleUpdate} />
                      <CloseOutlined style={{ fontSize: '20px' }} onClick={() => setIsEditing(false)} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
                      <table>
                        <tbody>
                          {Object.entries(selectedClient).map(([key, value]) => (
                            <tr key={key}>
                              <td><strong>{key.replace(/_/g, " ")}:</strong></td>
                              <td>
                                <Input
                                  type="text"
                                  name={key}
                                  style={{ border: "none" }}
                                  value={value}
                                  onChange={handleEditChange}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    <h6
                      style={{
                        borderBottom: "3px black solid",
                        paddingBottom: "5px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}
                    >
                      Selected Client Details
                    </h6>
                    <div style={{ fontWeight: "bold", fontSize: "40px", textAlign: "center" }}>
                      <div style={{
                        borderBottom: "3px black solid",
                        paddingBottom: "5px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                      }}>
                        <div>{selectedClient.client_name}</div>
                        <div onClick={() => setIsEditing(true)}>
                          <EditOutlined style={{ fontSize: '24px' }} />
                        </div>
                        <div onClick={() => setModalShow(true)}>
                          <DeleteOutlined style={{ fontSize: '24px' }} />
                        </div>
                      </div>
                    </div>
                    <table>
                      <tbody>
                        <tr>
                          <td><strong>City</strong></td>
                          <td>{selectedClient.city}</td>
                        </tr>
                        <tr>
                          <td><strong>State</strong></td>
                          <td>{selectedClient.state}</td>
                        </tr>
                        <tr>
                          <td><strong>Mobile Number</strong></td>
                          <td>{selectedClient.mobile_number}</td>
                        </tr>
                        <tr>
                          <td><strong>Id</strong></td>
                          <td>{selectedClient.client_id}</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            ) : (
              <div style={{
                padding: "24px",
                paddingTop: "103px",
                color: "#ccc",
                textAlign: "center",
              }}>
                No client selected
              </div>
            )}
          </Card>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Delete"
          open={modalShow}
          footer={null}
          onCancel={handleCancelDelete}
        >
          <div style={{ marginBottom: 20 }}>
            <p>Are you sure you want to delete this client?</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleCancelDelete} style={{ marginRight: 10 }}>
              Cancel
            </button>
            <button type="primary" onClick={handleConfirmDelete}>
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ClientList;
