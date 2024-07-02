import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table,pagination } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Adjust the URL to match your backend endpoint for fetching team members


const Member = () => {
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
  console.log(teamMembers)



  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/team_members/${teamId}`);
      // console.log(response.data )
      return response.data.teamMembers[0] || []; // Adjust according to your API response structure
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
      console.log(response.data)
      return response.data.users || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:8082/roles");
      console.log(response.data.items)
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:8082/team");
      console.log(response.data)
      return response.data.items || [];
    } catch (error) {
      console.error("Error fetching teams:", error);
      return [];
    }
  };

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setSelectedUser("");
    setSelectedRole("");
    setSelectedTeam("");
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
        closeInviteModal();
      })
      .catch(error => {
        console.error("Error adding member:", error);
        toast.error("Error adding member!");
      });
  };

  const handleTeamChange = (e) => {
    const newTeamId = e.target.value;
    setSelectedTeam(newTeamId);
    localStorage.setItem('selectedTeamId', newTeamId);
    
    fetchTeamMembers().then(allTeamMembers => {
      // console.log("Fetched data:", allTeamMembers.filter(member => member.team_id === parseInt(newTeamId)))
      const filteredTeamMembers = allTeamMembers.filter(member => member.team_id === parseInt(newTeamId));
      console.log("Fetched team members:", filteredTeamMembers); // Log the fetched team members
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
    // {
    //   title: 'Team ID',
    //   dataIndex: 'team_id',
    //   key: 'team_id',
    // },
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
            <button onClick={openInviteModal}>
              Add Members
            </button>
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
                <section
                  className="tw-h-full tw-pr-50px"
                  
                >
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
          <Modal show={isInviteModalOpen} onHide={closeInviteModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formUser">
                  <Form.Label>User</Form.Label>
                  <Form.Control as="select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formRole" style={{ marginTop: '10px' }}>
                  <Form.Label>Role</Form.Label>
                  <Form.Control as="select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formTeam" style={{ marginTop: '10px' }}>
                  <Form.Label>Team</Form.Label>
                  <Form.Control as="select" value={selectedTeam} onChange={handleTeamChange}>
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeInviteModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleAddMember}>
                Add Member
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      
    </div>
  );
}  

export default Member;
