import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Input, notification, Card, Button } from "antd";
import { Modal } from "react-bootstrap";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Cookies from 'js-cookie'; // For managing authentication tokens
import "../pages/Login.css";
import { Table, Form, Input, notification, Card } from "antd";
import { Modal, Button } from "react-bootstrap";
import {
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../pages/Login.css";
const api_address = process.env.REACT_APP_API_ADDRESS;

const Team = () => {
  const [name, setName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [teamName, setTeamName] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      // Redirect or show unauthorized message
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
    axios
      .get("http://localhost:8082/team")
      .then((res) => {
        if (res.data.success) {
          setAuth(true);
          setName(res.data.name);
          setFilteredData(res.data.items);
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        notification.error({ message: "Failed to fetch teams" });
      });
  }, []);
  

  const openCreateModal = () => setIsCreateModalOpen(true);

  const closeCreateModal = () => {
    setTeamName("");
    setIsCreateModalOpen(false);
  };

  const handleCreate = () => {
    axios
      .post(`${api_address}/team/create`, { name: teamName })
      .then((response) => {
        notification.success({ message: "Team created successfully" });
        closeCreateModal();
        axios
          .get(`${api_address}/team`)
          .then((res) => {
            if (res.data.success) {
              setFilteredData(res.data.items);
            } else {
              setMessage(res.data.error);
            }
          })
          .catch((err) => {
            console.error(err);
            notification.error({ message: "Failed to fetch updated team list" });
          });
      })
      .catch((error) => {
        console.error("Error creating team:", error);
        notification.error({ message: "Failed to create team" });
      });
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${api_address}/team`)
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
        .put(`${api_address}/team/edit/${selectedItem.id}`, editedItem)
        .then(() => {
          const updatedData = filteredData.map((item) =>
            item.id === selectedItem.id ? editedItem : item
          );
          setFilteredData(updatedData);
          setSelectedItem(editedItem);
          setIsEditing(false);
          setEditingTeamId(null);
          notification.success({ message: "Team updated successfully" });
        })
        .catch((err) => {
          console.error(err);
          notification.error({ message: "Failed to update team" });
        });
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
        .delete(`${api_address}/team/delete/${selectedItem.id}`)
        .then(() => {
          const updatedData = filteredData.filter(
            (team) => team.id !== selectedItem.id
          );
          setFilteredData(updatedData);
          setSelectedItem(null);
          setIsDeleteModalOpen(false);
          notification.success({ message: "Team deleted successfully" });
        })
        .catch((err) => {
          console.log(err);
          notification.error({ message: "Failed to delete team" });
        });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: "Team",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        editingTeamId === record.id ? (
          <Input
            type="text"
            name="name"
            value={editedItem ? editedItem.name : ""}
            onChange={handleEditChange}
            style={{ border: "none", padding: "10px" }}
          />
        ) : (
          text
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) =>
        editingTeamId === record.id ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button onClick={handleUpdate} icon={<SaveOutlined />}>
              Save
            </Button>
            <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>
              Cancel
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <button
                onClick={() => handleEditClick(record.id)}
                icon={<EditOutlined />}
              >
                Edit
              </button>
            </div>
            <div>
              <button
                onClick={() => handleDelete(record.id)}
                type="danger"
                icon={<DeleteOutlined />}
              >
                Delete
              </button>
            </div>
          </div>
        ),
    },
  ];

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
          <h2>Team</h2>
          <Button
            icon={<UploadOutlined />}
            onClick={openCreateModal}
          >
            Create Team
          </Button>
        </div>

        <Card
          className="mb-3"
          style={{
            width: "100%",
            padding: "10px",
            textAlign: "left",
            height: "calc(73vh - 64px)",
          }}
        >
          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={false}
          />

          {/* Delete Modal */}
          <Modal show={isDeleteModalOpen} onHide={handleCancelDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Team</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to delete this team?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Create Team Modal */}
          <Modal show={isCreateModalOpen} onHide={closeCreateModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Create Team</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Item
                  name="name"
                  label="Team Name"
                  rules={[{ required: true, message: "Please enter team name" }]}
                >
                  <Input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </Form.Item>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeCreateModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreate}>
                Create
              </Button>
            </Modal.Footer>
          </Modal>
        </Card>
      </div>
    </div>
  );
};

export default Team;