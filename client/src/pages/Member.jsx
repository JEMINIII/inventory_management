// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {Link} from "react-router-dom"
// import { Card } from "antd";
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';

// const Member = () => {
//   const [name, setName] = useState("");
//   const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
//   const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
//   const [auth, setAuth] = useState(false);
//   const [message, setMessage] = useState("");
//   const [email, setEmail] = useState("");
//   const [users, setUsers] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");

//   const openInviteModal = () => {
//     setIsInviteModalOpen(true);
//   };

//   const closeInviteModal = () => {
//     setEmail(''); // Clear the input field
//     setIsInviteModalOpen(false);
//   };

//   const handleInvite = () => {
//     axios.post("http://localhost:8082/send-email", { email })
//       .then(response => {
//         console.log("Email sent:", response.data);
//         setEmail(''); // Clear the input field
//         closeInviteModal();
//       })
//       .catch(error => {
//         console.error("Error sending email:", error);
//       });
//   };

//   const handleAddMember = () => {
//     axios.post("http://localhost:8082/api/team_members", { user_id: selectedUser, role_id: selectedRole })
//       .then(response => {
//         console.log("Member added:", response.data);
//         closeInviteModal();
//       })
//       .catch(error => {
//         console.error("Error adding member:", error);
//       });
//   };

//   useEffect(() => {
//     axios.defaults.withCredentials = true;
//     axios
//       .get("http://localhost:8082/api/users")
//       .then((res) => {
//         if (res.data.success) {
//           setAuth(true);
//           setName(res.data.name);
//           setUsers(res.data.users || []); // Ensure users is an array
//         } else {
//           setAuth(false);
//           setMessage(res.data.error);
//         }
//       })
//       .catch((err) => console.log(err));

//     axios
//       .get("http://localhost:8082/api/roles")
//       .then((res) => {
//         setRoles(res.data);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const [activeTab, setActiveTab] = useState("All Members");

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <div>
//       <div className="container mt-4">
//         <div style={{
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           maxHeight: "calc(80vh - 74px)",
//         }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               marginBottom: 30,
//               height: "calc(100vh - 64px)",
//               borderBottom: "2px skyblue solid"
//             }}
//           >
//             <h2>Members</h2>
//             <Button onClick={openInviteModal}>
//               Add Members
//             </Button>
            
//           </div>

//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               flexDirection: isSmallScreen ? "column" : "row"
//             }}
//           >
//             <Card className="mb-3" style={{ width: "100%", padding: '10px', textAlign: 'left', height: "calc(73vh - 64px)", overflowY: "auto" }}>
//               <section className="tw-flex-1 tw-overflow-auto">
//                 <section
//                   className="tw-h-full tw-pr-50px"
//                   style={{ minWidth: "948px", maxWidth: "1660px" }}
//                 >
//                   <div className="tw-px-40px tw-pb-40px">
//                     <div className="_with-breadcrumbs_n780a_85 tw-flex-none"></div>
//                     <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }} className="tab-menu-container tw-flex-none tw-mt-[10px]">
//                       <div
//                         className={`tab-menu ${activeTab === "All Members" && "active"}`}
//                         onClick={() => handleTabClick("All Members")}
//                       >
//                         All Members
//                       </div>
//                       <div
//                         className={`tab-menu ${activeTab === "Custom Permissions" && "active"}`}
//                         onClick={() => handleTabClick("Custom Permissions")}
//                       >
//                         Custom Permissions
//                       </div>
//                     </div>

//                     <div className="tw-w-full tw-overflow-x-auto">
//                       {activeTab === "All Members" && (
//                         <div>
//                           <div className="tw-flex tw-items-center tw-flex-none tw-mt-10px _control-bar_zpmz1_1">
//                             {/* Invite Members Modal */}
//                             <Modal show={isInviteModalOpen} onHide={closeInviteModal} centered>
//                               <Modal.Header closeButton>
//                                 <Modal.Title>Invite Members</Modal.Title>
//                               </Modal.Header>
//                               <Modal.Body>
//                                 <Form>
//                                   <Form.Group controlId="formBasicUser">
//                                     <Form.Label>Select User</Form.Label>
//                                     <Form.Control as="select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
//                                       <option value="">Select a user</option>
//                                       {Array.isArray(users) && users.map(user => (
//                                         <option key={user.id} value={user.id}>{user.name}</option>
//                                       ))}
//                                     </Form.Control>
//                                   </Form.Group>
//                                   <Form.Group controlId="formBasicRole">
//                                     <Form.Label>Select Role</Form.Label>
//                                     <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
//                                       <option value="">Select a role</option>
//                                       {Array.isArray(roles) && roles.map(role => (
//                                         <option key={role.id} value={role.id}>{role.name}</option>
//                                       ))}
//                                     </Form.Control>
//                                   </Form.Group>
//                                 </Form>
//                               </Modal.Body>
//                               <Modal.Footer>
//                                 <Button variant="secondary" onClick={closeInviteModal}>
//                                   Close
//                                 </Button>
//                                 <Button variant="primary" onClick={handleAddMember}>
//                                   Add Member
//                                 </Button>
//                               </Modal.Footer>
//                             </Modal>
//                           </div>

//                           <div className="tw-w-full tw-overflow-x-auto">
//                             <table className="general-table tw-w-full tw-mt-[10px]">
//                               <thead>
//                                 <tr className="general-table--header">
//                                   <th>Name</th>
//                                   <th>Permissions</th>
//                                   <th></th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 <tr className="general-table--item">
//                                   <td>
//                                     <div className="tw-flex tw-items-center">
//                                     {Array.isArray(users) && users.map(user => (
//                                         <option key={user.id} value={user.id}>{user.name}</option>
//                                       ))}
                                      
//                                     </div>
//                                   </td>
//                                   <td className="tw-flex tw-items-center tw-flex-auto">
//                                     <button
//                                       disabled=""
//                                       className="btn with-icon tw-flex tw-justify-between _role-selector_5o2kw_4"
//                                     >
//                                       <span className="tw-truncate">Admin</span>
//                                       <i className="icon icon-dropdown right-icon"></i>
//                                     </button>
//                                     <div className="tw-truncate tw-ml-20px tw-flex-auto">
//                                       Can access all data and activities.
//                                     </div>
//                                   </td>
//                                   <td className="tw-flex-none tw-text-right">
//                                     <button className="btn with-icon tw-text-gray tw-pr-0 tw-pl-0 _edit-button_zpmz1_7">
//                                       <span>Edit</span>
//                                     </button>
//                                   </td>
//                                 </tr>
//                               </tbody>
//                               <tfoot>
//                                 <tr>
//                                   <td colSpan="3">
//                                     <div className="tw-flex tw-items-center tw-justify-center">
//                                       <button className="btn with-icon tw-mr-[15px] medium tw-text-primary _new-permission_12v3f_53">
//                                         Add Custom Permission
//                                       </button>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               </tfoot>
//                             </table>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </section>
//               </section>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Member;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "antd";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


const fetchTeamMembers = async (teamId) => {
  try {
    const response = await axios.get(`http://localhost:8082/api/team_members/${teamId}`);
    return response.data.teamMembers;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
};
const Member = () => {
  const [name, setName] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [teamMembers, setTeamMembers] = useState([]);
  const teamId = localStorage.getItem('team_id');

  useEffect(() => {
    if (teamId) {
      fetchTeamMembers(teamId).then(setTeamMembers);
    }
  }, [teamId]);


  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setSelectedUser(""); // Clear the selected user
    setSelectedRole(""); // Clear the selected role
    setIsInviteModalOpen(false);
  };



  const handleInvite = () => {
    axios.post("http://localhost:8082/send-email", { email })
      .then(response => {
        console.log("Email sent:", response.data);
        setEmail(""); // Clear the input field
        closeInviteModal();
      })
      .catch(error => {
        console.error("Error sending email:", error);
      });
  };

  const handleAddMember = () => {
    const team_id = localStorage.getItem('team_id'); // Get team_id from local storage

    axios.post("http://localhost:8082/api/team_members", { user_id: selectedUser, role_id: selectedRole, team_id })
      .then(response => {
        console.log("Member added:", response.data);
        closeInviteModal();
      })
      .catch(error => {
        console.error("Error adding member:", error);
      });
  };

  


  // useEffect(() => {
  //   axios.defaults.withCredentials = true;
  //   axios
  //     .get("http://localhost:8082/api/users")
  //     .then((res) => {
  //       if (res.data.success) {
  //         setAuth(true);
  //         setName(res.data.name);
  //         setUsers(res.data.users || []); // Ensure users is an array
  //       } else {
  //         setAuth(false);
  //         setMessage(res.data.error);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  
  //   axios
  //     .get("http://localhost:8082/roles")
  //     .then((res) => {
  //       // console.log("Roles:", res.data); // Add this line
  //       setRoles(res.data.items);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);
  

  const [activeTab, setActiveTab] = useState("All Members");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="container mt-4">
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
                                    <Form.Control as="select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                                      <option value="">Select a user</option>
                                      {Array.isArray(users) && users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                      ))}
                                    </Form.Control>
                                  </Form.Group>
                                  <Form.Group controlId="formBasicRole">
                                    <Form.Label>Select Role</Form.Label>
                                    <Form.Control as="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                      <option value="">Select a role</option>
                                      {Array.isArray(roles) && roles.map(role => {
                                        // console.log("Role:", role); // Add this line
                                        return (
                                          <option key={role.id} value={role.id}>{role.name}</option>
                                        );
                                      })}

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

                          <div className="tw-w-full tw-overflow-x-auto">
                            <table className="general-table tw-w-full tw-mt-[10px]">
                              <thead>
                                <tr className="general-table--header">
                                  <th>Name</th>
                                  <th>Permissions</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(users) && users.map(user => (
                                  <tr key={user.id} className="general-table--item">
                                    <td>
                                      <div className="tw-flex tw-items-center">
                                        {user.name}
                                      </div>
                                    </td>
                                    <td className="tw-flex tw-items-center tw-flex-auto">
                                      <button
                                        disabled=""
                                        className="btn with-icon tw-flex tw-justify-between _role-selector_5o2kw_4"
                                      >
                                        <span className="tw-truncate">Admin</span>
                                        <i className="icon icon-dropdown right-icon"></i>
                                      </button>
                                      <div className="tw-truncate tw-ml-20px tw-flex-auto">
                                        Can access all data and activities.
                                      </div>
                                    </td>
                                    <td className="tw-flex-none tw-text-right">
                                      <button className="btn with-icon tw-text-gray tw-pr-0 tw-pl-0 _edit-button_zpmz1_7">
                                        <span>Edit</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan="3">
                                    <div className="tw-flex tw-items-center tw-justify-center">
                                      <button className="btn with-icon tw-mr-[15px] medium tw-text-primary _new-permission_12v3f_53">
                                        Add Custom Permission
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      )}
                      {activeTab === "Custom Permissions" && (
                        <div>Custom Permissions Tab Content</div>
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
