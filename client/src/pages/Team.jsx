import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Form, Input, notification, Card } from "antd";
import { SaveOutlined, CloseOutlined, EditOutlined,UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import Button from 'react-bootstrap/Button';
import {Link} from "react-router-dom";


const Team = () => {
  const [name, setName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setTeamName("");
    
    setIsCreateModalOpen(false);
  };

 

  const handleCreate = () => {
    axios
      .post("http://localhost:8082/team/create", { name: teamName })
      .then((response) => {
        console.log("Team created:", response.data);
        notification.success({ message: "Team created successfully" });
        closeCreateModal();
  
        // Fetch the updated team list
        axios.get("http://localhost:8082/team")
          .then((res) => {
            if (res.data.success === true) {
              setFilteredData(res.data.items);
            } else {
              setMessage(res.data.error);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((error) => {
        console.error("Error creating team:", error);
        notification.error({ message: "Failed to create team" });
      });
  };
  

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8082/team")
      .then((res) => {
        if (res.data.success === true) {
          setAuth(true);
          setName(res.data.name);
          setFilteredData(res.data.items);
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleItemClick = (team) => {
    setSelectedItem(team);
    setEditedItem({ ...team });
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
    if (selectedItem && selectedItem.id) {
      axios
        .put(`http://localhost:8082/team/edit/${selectedItem.id}`, editedItem)
        .then(() => {
          const updatedData = filteredData.map((item) =>
            item.id === selectedItem.id ? editedItem : item
          );
          setFilteredData(updatedData);
          setSelectedItem(editedItem);
          setIsEditing(false);
          setEditingTeamId(null);
          notification.success({ message: 'Team updated successfully' });
        })
        .catch((err) => console.log(err));
    }
  };
  

  const handleEditClick = (id) => {
    setEditingTeamId(id);
    const teamToEdit = filteredData.find((team) => team.id === id);
    setEditedItem({ ...teamToEdit });
    setSelectedItem(teamToEdit);
  };

  const handleCancelEdit = () => {
    setEditingTeamId(null);
    setEditedItem(null);
  };

  const handleDelete = (id) => {
    const teamToDelete = filteredData.find((team) => team.id === id);
    setSelectedItem(teamToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem && selectedItem.id) {
      axios
        .delete(`http://localhost:8082/team/delete/${selectedItem.id}`)
        .then(() => {
          const updatedData = filteredData.filter((team) => team.id !== selectedItem.id);
          setFilteredData(updatedData);
          setSelectedItem(null);
          setIsDeleteModalOpen(false);
          notification.success({ message: 'Team deleted successfully' });
        })
        .catch((err) => {
          console.log(err);
          notification.error({ message: 'Failed to delete team' });
        });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: 'Team',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        editingTeamId === record.id ? (
          <Input
            type="text"
            name="name"
            value={editedItem ? editedItem.name : ''}
            onChange={handleEditChange}
            style={{ border: 'none', padding: '10px' }}
          />
        ) : (
          text
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        editingTeamId === record.id ? (
          <div style={{display:'flex',gap:'10px'}}>
          <div>
            <Button onClick={handleUpdate} >Save</Button>
            </div>
            <div>
            <Button onClick={handleCancelEdit}>Cancel</Button>
          </div>
          </div>
        ) : (
          <div style={{display:'flex',gap:'10px'}}>
          <div>
            <Button onClick={() => handleEditClick(record.id)} >Edit</Button>
            </div>
            <div>
            <Button onClick={() => handleDelete(record.id)} type="danger">Delete</Button>
          </div>
          </div>
        )
      ),
    },
  ];

  return (
    <div>
      {/* <div className="container mt-4"> */}
      {auth ? (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", maxHeight: "calc(80vh - 74px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30, borderBottom: "2px skyblue solid" }}>
            <h2>Team</h2>
            <Button onClick={openCreateModal}>Create Team</Button>
            
          </div>

          <Card className="mb-3" style={{ width: "100%", padding: '10px', textAlign: 'left', height: "calc(73vh - 64px)" }}>
            <Table
              dataSource={filteredData}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 5 }} // Enable pagination with 5 items per page
              scroll={false} // Disable scrolling
              
            />
            

            <Modal
              title="Delete Team"
              visible={isDeleteModalOpen}
              onOk={handleConfirmDelete}
              onCancel={handleCancelDelete}
            >
              <p>Are you sure you want to delete this team?</p>
            </Modal>

            <Modal
        title="Create Team"
        visible={isCreateModalOpen}
        onCancel={closeCreateModal}
        footer={[
          <div style={{display:'flex',gap:'10px'}}>
          <div>
          <Button key="back" onClick={closeCreateModal}>
            Close
          </Button>
          </div>
          <div>
          <Button key="submit" type="primary" onClick={handleCreate}>
            Create
          </Button>
          </div>
          </div>
        ]}
      >
        <Form>
          <Form.Item label="Team Name">
            <Input
              type="text"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
          </Card>
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

export default Team;
