import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Card, Table } from "antd";
import { Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TeamContext } from "../context/TeamContext"; // Assuming you have a TeamContext
const api_address = process.env.REACT_APP_API_ADDRESS;
const Member = () => {
  const { teamId } = localStorage.getItem('selectedTeamId')
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(
    localStorage.getItem("selectedTeamId") || ""
  );
  const [auth, setAuth] = useState(false);

  // New state variables for the invite modal
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  

  const fetchTeamMembers = async (teamId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${api_address}/api/team_members/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true 
        }
      );
      console.log("Fetched Team Members:", response.data.teamMembers);
      setTeamMembers(response.data.teamMembers || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };
  
  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam);
    }
  }, [selectedTeam]);
  

  useEffect(() => {
    if (teamId) {
      fetchTeamMembers(teamId).then((data) => {
        console.log("Setting teamMembers state:", data);
        setTeamMembers(data);
      });
    }
  }, [teamId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData, teamsData] = await Promise.all([
          fetchUsers(),
          fetchRoles(),
          fetchTeams(),
        ]);
        setUsers(usersData);
        setRoles(rolesData);
        setTeams(teamsData);
        console.log("Fetched Users:", usersData);
        console.log("Fetched Roles:", rolesData);
        console.log("Fetched Teams:", teamsData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${api_address}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true 
        }
      );
      console.log("Fetched Users:", response.data.users);
      return response.data.users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchRoles = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${api_address}/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true 
        }
      );
      console.log("Fetched Roles:", response.data.items);
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  };

  const fetchTeams = async () => {
    const token = localStorage.getItem('token');
    const orgId = localStorage.getItem('org_id');
    if (!orgId) {
      console.error("Organization ID is not available.");
      return []; // Early return if org_id is missing
    }
  
    try {
      const response = await axios.get(`${api_address}/team`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { org_id: orgId }, // Include org_id as a query parameter
        withCredentials: true,
      });
      console.log("Fetched Teams:", response.data.items);
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    }
  };
  

  const openAddMemberModal = () => {
    setIsAddMemberModalOpen(true);
  };

  const closeAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
    setSelectedUser("");
    setSelectedRole("");
  };

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
    // Generate an invite code when opening the modal
    setInviteCode(`INV-${Math.random().toString(36).substr(2, 9)}`);
  };

  const closeInviteModal = () => {
    setInviteEmail("");
    setInviteName("");
    setInviteCode("");
    setIsInviteModalOpen(false);
  };

  const handleAddMember = () => {
    if (!selectedUser || !selectedRole || !teamId) {
      toast.error("Please select a user, role, and team.");
      return;
    }

    axios
      .post(`${api_address}/api/team_members`, {
        user_id: selectedUser,
        role_id: selectedRole,
        team_id: teamId,
      })
      .then((response) => {
        toast.success("Member added successfully!");
        setAuth(true); // Assuming successful member addition means user is authenticated
        fetchTeamMembers(teamId).then((data) => {
          console.log("Updated teamMembers state after adding member:", data);
          setTeamMembers(data);
        });
        closeAddMemberModal();
      })
      .catch((error) => {
        setAuth(false); // Reset authentication state if there's an error
        console.error("Error adding member:", error);
        toast.error("Error adding member!");
      });
  };

  const handleSendInvite = () => {
    // Example check: Ensure inviteEmail and inviteName are filled
    if (!inviteEmail || !inviteName) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Example authentication check: Assume some form of authentication check
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // Example: Check if user is logged in
    if (!isLoggedIn) {
      toast.error("You are not authenticated. Please log in to send invites.");
      return;
    }

    axios
      .post(`${api_address}/api/invite`, {
        email: inviteEmail,
        name: inviteName,
        inviteCode,
      })
      .then((response) => {
        setAuth(true); // Assuming successful invitation means user is authenticated
        toast.success("Invitation sent successfully!");
        closeInviteModal();
      })
      .catch((error) => {
        setAuth(false); // Reset authentication state if there's an error
        console.error(
          "Error sending invite:",
          error.response ? error.response.data : error.message
        );
        toast.error(
          error.response ? error.response.data.message : "Error sending invite!"
        );
      });
  };

  const handleTeamChange = (e) => {
    const newTeamId = e.target.value;
    setSelectedTeam(newTeamId);
    // localStorage.setItem("selectedTeamId", newTeamId);

    // Fetch team members for the selected team
    fetchTeamMembers(newTeamId).then((data) => {
      // Update teamMembers state with fetched data
      setTeamMembers((prevTeamMembers) => {
        const updatedMembers = [...prevTeamMembers];
        updatedMembers[newTeamId - 1] = data; // Assuming team IDs are sequential
        return updatedMembers;
      });
    });
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "user_name",
      key: "user_id",
    },
    {
      title: "Role Name",
      dataIndex: "role_name",
      key: "role_id",
    },
  ];

  return (
    <div>
      <ToastContainer />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            paddingTop: "30px",
            borderBottom: "2px black solid",
          }}
        >
          <h2
            style={{
              padding: "10px",
            }}
          >
            Members
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <button onClick={openAddMemberModal}>Add Member</button>
            <button variant="primary" onClick={openInviteModal}>
              Invite Member
            </button>
          </div>
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
              height: "calc(73vh - 64px)",
              overflowY: "auto",
            }}
          >
            <section className="tw-flex-1 tw-overflow-auto">
              <section className="tw-h-full tw-pr-50px">
                <div className="tw-px-40px tw-pb-40px">
                  {selectedTeam && (
                    <Table
                      columns={columns}
                      dataSource={teamMembers[selectedTeam - 1]} // Assuming team IDs are 1-indexed
                      rowKey="user_id"
                      pagination={{ pageSize: 5 }}
                    />
                  )}
                </div>
              </section>
            </section>
          </Card>
        </div>

        {/* Add Member Modal */}
        <Modal
          show={isAddMemberModalOpen}
          onHide={closeAddMemberModal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formSelectUser">
                <Form.Label>Select User</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.user_id} value={user.user_id}>
                      {user.user_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formSelectRole">
                <Form.Label>Select Role</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button variant="secondary" onClick={closeAddMemberModal}>
              Cancel
            </button>
            <button variant="primary" onClick={handleAddMember}>
              Add Member
            </button>
          </Modal.Footer>
        </Modal>

        {/* Invite Member Modal */}
        <Modal show={isInviteModalOpen} onHide={closeInviteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Invite Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formInviteEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formInviteName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formInviteCode">
                <Form.Label>Invite Code</Form.Label>
                <Form.Control type="text" readOnly value={inviteCode} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button variant="secondary" onClick={closeInviteModal}>
              Cancel
            </button>
            <button variant="primary" onClick={handleSendInvite}>
              Send Invite
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Member;