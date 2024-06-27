import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card } from "antd";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetchTeamMembers = async (team_id) => {
  try {
    const response = await axios.get(`http://localhost:8082/api/team_members/${team_id}`);
    console.log("Fetched team members:", response);
    return response.data.teamMembers.flat(); // Flatten the nested arrays
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
};

const fetchUsers = async () => {
  try {
    const response = await axios.get("http://localhost:8082/api/users");
    return response.data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

const fetchRoles = async () => {
  try {
    const response = await axios.get("http://localhost:8082/roles");
    return response.data.items;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

const fetchTeams = async () => {
  try {
    const response = await axios.get("http://localhost:8082/team");
    return response.data.items;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};

const Member = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [auth, setAuth] = useState(false);
  const [items, setItems] = useState([]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const team_id = localStorage.getItem('team_id');

  useEffect(() => {
    if (team_id) {
      fetchTeamMembers(team_id).then(setTeamMembers);
    }
  }, [team_id]);

  useEffect(() => {
    const fetchData = async () => {
      const [usersData, rolesData, teamsData] = await Promise.all([fetchUsers(), fetchRoles(), fetchTeams()]);
      setUsers(usersData);
      setRoles(rolesData);
      setTeams(teamsData);
    };

    fetchData();
  }, []);

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setSelectedUser(""); // Clear the selected user
    setSelectedRole(""); // Clear the selected role
    setSelectedTeam(""); // Clear the selected team
    setIsInviteModalOpen(false);
  };

  const handleInvite = () => {
    axios.post("http://localhost:8082/send-email", { email })
      .then(response => {
        toast.success("Email sent successfully!");
        setEmail(""); // Clear the input field
        closeInviteModal();
      })
      .catch(error => {
        console.error("Error sending email:", error);
        toast.error("Error sending email!");
      });
  };

  useEffect(() => {
    const team_id = localStorage.getItem('team_id');
    console.log("Retrieved team_id from localStorage:", team_id);
    if (team_id) {
      setTeamId(team_id);
    }
  }, []);
  
  
  useEffect(() => {
    axios.defaults.withCredentials = true;

    console.log("Current teamId:", teamId);
    console.log("Current auth status:", auth);
    if (teamId) {
      axios.get(`http://localhost:8082/team_members?team_id=${teamId}`)
        .then((res) => {
          if (res.data.success === true) {
            setAuth(true);
            const sortedMembers = res.data.items.sort((a, b) =>
              a.member_name.localeCompare(b.member_name)
            );
            setItems(res.data.items);
            setData(sortedMembers);
            setFilteredData(sortedMembers);
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

  const handleAddMember = () => {
    if (!selectedUser || !selectedRole || !selectedTeam) {
      toast.error("Please select a user, role, and team.");
      return;
    }

    axios.post("http://localhost:8082/api/team_members", { user_id: selectedUser, role_id: selectedRole, team_id: selectedTeam })
      .then(response => {
        toast.success("Member added successfully!");
        fetchTeamMembers(selectedTeam).then(setTeamMembers); // Refresh team members list
        closeInviteModal();
        setAuth(true)
      })
      .catch(error => {
        console.error("Error adding member:", error);
        if (error.response && error.response.status === 400) {
          toast.error("This combination is already present.");
        } else {
          toast.error("Error adding member!");
        }
      });
  };

  const [activeTab, setActiveTab] = useState("All Members");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <ToastContainer />
        
      <div>
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
              borderBottom: "2px black solid"
            }}
          >
            <h2>Members</h2>
            <Button onClick={openInviteModal}>
              Add Members
            </Button>
          </div>

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
                  style={{ minWidth: "948px", maxWidth: "1660px" }}
                >
                  <div className="tw-px-40px tw-pb-40px">
                    <div className="_with-breadcrumbs_n780a_85 tw-flex-none"></div>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }} className="tab-menu-container tw-flex-none tw-mt-[10px]">
                      <div
                        className={`tab-menu ${activeTab === "All Members" && "active"}`}
                        onClick={() => handleTabClick("All Members")}
                      >
                        All Members
                      </div>
                      <div
                        className={`tab-menu ${activeTab === "Custom Permissions" && "active"}`}
                        onClick={() => handleTabClick("Custom Permissions")}
                      >
                        Custom Permissions
                      </div>
                    </div>

                    <div className="tw-w-full tw-overflow-x-auto">
                      {activeTab === "All Members" && (
                        <div>
                          <div className="tw-flex tw-items-center tw-flex-none tw-mt-10px _control-bar_zpmz1_1">
                            {/* Invite Members Modal */}
                            <Modal show={isInviteModalOpen} onHide={closeInviteModal} centered>
                              <Modal.Header closeButton>
                                <Modal.Title>Invite Members</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <Form>
                                  <Form.Group controlId="formBasicUser">
                                    <Form.Label>Select User</Form.Label>
                                    <Form.Control
                                      as="select"
                                      value={selectedUser}
                                      onChange={(e) => setSelectedUser(e.target.value)}
                                      required // Add required attribute for client-side validation
                                    >
                                      <option value="">Select a user</option>
                                      {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                          {user.name}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </Form.Group>

                                  <Form.Group controlId="formBasicRole">
                                    <Form.Label>Select Role</Form.Label>
                                    <Form.Control
                                      as="select"
                                      value={selectedRole}
                                      onChange={(e) => setSelectedRole(e.target.value)}
                                    >
                                      <option value="">Select a role</option>
                                      {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                          {role.name}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </Form.Group>
                                  <Form.Group controlId="formBasicTeam">
                                    <Form.Label>Select Team</Form.Label>
                                    <Form.Control
                                      as="select"
                                      value={selectedTeam}
                                      onChange={(e) => setSelectedTeam(e.target.value)}
                                    >
                                      <option value="">Select a team</option>
                                      {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                          {team.name}
                                        </option>
                                      ))}
                                    </Form.Control>
                                  </Form.Group>
                                  <Button variant="primary" onClick={handleAddMember}>
                                    Add Member
                                  </Button>
                                </Form>
                              </Modal.Body>
                            </Modal>
                          </div>

                          <table className="tw-w-full tw-bg-white tw-mt-30px tw-border tw-border-light-border tw-rounded-md">
                            <thead>
                              <tr className="tw-border-b tw-border-light-border">
                                <th className="tw-px-6 tw-py-3 tw-text-left">Name</th>
                                <th className="tw-px-6 tw-py-3 tw-text-left">Role</th>
                                <th className="tw-px-6 tw-py-3 tw-text-left">Team</th>
                              </tr>
                            </thead>
                            <tbody className="tw-text-sm">
                              {teamMembers.length > 0 ? (
                                teamMembers.map((member, index) => (
                                  <tr key={index} className="tw-border-b tw-border-light-border">
                                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                                      {member.name}
                                    </td>
                                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                                      {roles.find((role) => role.id === member.role_id)?.name || "Unknown"}
                                    </td>
                                    <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
                                      {teams.find((team) => team.id === member.team_id)?.name || "Unknown"}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="3" className="tw-px-6 tw-py-4 tw-text-center">
                                    No members found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {activeTab === "Custom Permissions" && (
                        <div>Custom Permissions content goes here...</div>
                      )}
                    </div>
                  </div>
                </section>
              </section>
            </Card>
          </div>
        </div>
      </div>
       
    </div>
  );
};

export default Member;
