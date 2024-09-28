// // src/index.js
// import React, { useContext, useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';
// import axios from 'axios';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { TeamContext } from "../context/TeamContext";
// import { Table, Spin, Alert } from 'antd';  // Import Ant Design components
// import 'antd/dist/reset.css'; // Import Ant Design styles

// const api_address = process.env.REACT_APP_API_ADDRESS;

// // API Service to Fetch Stock History
// const fetchStockHistory = async (teamId) => {
//   try {
//     const response = await axios.get(`${api_address}/products/stock-history?teamId=${teamId}`);
//     return response.data.history;
//   } catch (error) {
//     console.error("Error fetching stock history:", error);
//     return [];
//   }
// };

// // Stock History Component
// const Adjust = () => {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { teamId } = useContext(TeamContext);

//   useEffect(() => {
//     const getHistory = async () => {
//       try {
//         const data = await fetchStockHistory(teamId);
//         setHistory(data);
//       } catch (err) {
//         setError('Failed to fetch stock history');
//       } finally {
//         setLoading(false);
//       }
//     };

//     getHistory();
//   }, [teamId]);

//   if (loading) {
//     return <Spin size="large" />;
//   }

//   if (error) {
//     return <Alert message={error} type="error" />;
//   }

//   const columns = [
//     {
//       title: 'Product Name',
//       dataIndex: 'product_name',
//       key: 'product_name',
//     },
//     {
//       title: 'Quantity',
//       dataIndex: 'quantity',
//       key: 'quantity',
//     },
//     {
//       title: 'User',
//       dataIndex: 'user_name',
//       key: 'user_name',
//     },
//     {
//       title: 'Action',
//       dataIndex: 'action',
//       key: 'action',
//     },
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//       render: (text) => new Date(text).toLocaleString(),
//     },
//   ];

//   return (
//     <div className="stock-history">
//       <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: 30,
//                 marginTop: 30,
//                 // height: "calc(100vh - 64px)",
//                 borderBottom: "2px black solid"
//               }}
//             >
//               <h2 style={{ marginBottom: 30 }}>Stock History</h2>
              
//             </div>
//       <Table dataSource={history} columns={columns} rowKey="id" />
//     </div>
//   );
// };

// // Dashboard Page
// const Dashboard = () => {
//   const [teamId, setTeamId] = useState(null);

//   useEffect(() => {
//     // Retrieve the teamId from localStorage
//     const storedTeamId = localStorage.getItem('teamId');
//     if (storedTeamId) {
//       setTeamId(parseInt(storedTeamId, 10)); // Ensure it's a number
//     } else {
//       console.error('Team ID not found in localStorage');
//     }
//   }, []);

//   // Show a loading message or handle cases where teamId is not available
//   if (teamId === null) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="dashboard">
//       <h1>Inventory Dashboard</h1>
//       {/* Stock History Component */}
//       <Adjust teamId={teamId} />
//     </div>
//   );
// };


// export default Adjust;
