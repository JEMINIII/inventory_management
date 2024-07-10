import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Member = () => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(localStorage.getItem('selectedTeamId') || "");
  const [teamMembers, setTeamMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState([]);
  
  // New state variables for the invite modal
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteCode, setInviteCode] = useState("");


  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/team_members/${teamId}`);
      return response.data.teamMembers[0] || [];
    } catch (error) {
      console.error("Error fetching team members:", error);
      return [];
    }
  };

  const flattenTeamMembers = (teamMembersArray) => {
    if (!Array.isArray(teamMembersArray)) {
      return [];
    }
    return teamMembersArray;
  };

  

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam).then(data => setTeamMembers(data));
    }
  }, [selectedTeam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData, teamsData] = await Promise.all([
          fetchUsers(),
          fetchRoles(),
          fetchTeams()
        ]);
        setUsers(usersData);
        setRoles(rolesData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/users");
      return response.data.users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:8082/roles");
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:8082/team");
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
    // Generate a Invite code when opening the modal
    setInviteCode(`INV-${Math.random().toString(36).substr(2, 9)}`);
  };

  const closeInviteModal = () => {
    setInviteEmail("");
    setInviteName("");
    setInviteCode("");
    setIsInviteModalOpen(false);
  };

  const handleAddMember = () => {
    if (!selectedUser || !selectedRole || !selectedTeam) {
      toast.error("Please select a user, role, and team.");
      return;
    }

    axios.post("http://localhost:8082/api/team_members", { user_id: selectedUser, role_id: selectedRole, team_id: selectedTeam })
      .then(response => {
        toast.success("Member added successfully!");
        fetchTeamMembers(selectedTeam).then(setTeamMembers);
        closeAddMemberModal();
      })
      .catch(error => {
        console.error("Error adding member:", error);
        toast.error("Error adding member!");
      });
  };

  const handleSendInvite = () => {
    if (!inviteEmail || !inviteName) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    axios.post("http://localhost:8082/api/invite", { email: inviteEmail, name: inviteName, inviteCode })
      .then(response => {
        toast.success("Invitation sent successfully!");
        closeInviteModal();
      })
      .catch(error => {
        console.error("Error sending invite:", error.response ? error.response.data : error.message);
        toast.error(error.response ? error.response.data.message : "Error sending invite!");
      });
  };


  const handleTeamChange = (e) => {
    const newTeamId = e.target.value;
    setSelectedTeam(newTeamId);
    localStorage.setItem('selectedTeamId', newTeamId);

    fetchTeamMembers().then(allTeamMembers => {
      const filteredTeamMembers = allTeamMembers.filter(member => member.team_id === parseInt(newTeamId));
      setTeamMembers(filteredTeamMembers);
    });
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_id',
    },
    {
      title: 'Role Name',
      dataIndex: 'role_name',
      key: 'role_id',
    },
  ];

  return (
    <div>
      <ToastContainer />

      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 30,
            paddingTop: '30px',
            borderBottom: "2px black solid"
          }}
        >
          <h2>Members</h2>
          <div style={{display: "flex",
            alignItems: "center",
            justifyContent: "space-end",}}>
          <button onClick={openAddMemberModal}>
            Add Member
          </button>
          <button variant="primary" onClick={openInviteModal}>
              Invite Member
            </button>
            </div>
        </div>
        <Form.Group controlId="formTeamSelection" style={{ marginBottom: 20 }}>
          <Form.Label>Team</Form.Label>
          <Form.Control as="select" value={selectedTeam} onChange={handleTeamChange}>
            <option style={{color:'orange'}} value="">Select Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: isSmallScreen ? "column" : "row"
          }}
        >
          <Card className="mb-3" style={{ width: "100%", padding: '10px', textAlign: 'left', height: "calc(73vh - 64px)", overflowY: "auto" }}>
            <section className="tw-flex-1 tw-overflow-auto">
              <section className="tw-h-full tw-pr-50px">
                <div className="tw-px-40px tw-pb-40px">
                  <Table
                    columns={columns}
                    dataSource={teamMembers}
                    rowKey="user_id"
                    pagination={{ pageSize: 5 }}
                  />
                </div>
              </section>
            </section>
          </Card>
        </div>

        {/* Add Member Modal */}
        <Modal show={isAddMemberModalOpen} onHide={closeAddMemberModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formSelectUser">
                <Form.Label>Select User</Form.Label>
                <Form.Control as="select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formSelectRole" style={{ marginTop: '10px' }}>
                <Form.Label>Select Role</Form.Label>
                <Form.Control as="select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                  <option value="">Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formSelectTeam" style={{ marginTop: '10px' }}>
                <Form.Label>Select Team</Form.Label>
                <Form.Control as="select" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                  <option value="">Select Team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAddMemberModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddMember}>
              Add Member
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Invite Modal */}
        <Modal show={isInviteModalOpen} onHide={closeInviteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Invite Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formInviteEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formInviteName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  style={{ marginTop: '10px' }}
                />
              </Form.Group>
              {/* Hide the invite code input box but still send the inviteCode in the request */}
              <Form.Control type="hidden" value={inviteCode} />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeInviteModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSendInvite}>
              Send Invite
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Member;
