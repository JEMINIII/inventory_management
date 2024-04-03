import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

export const Home = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [chartData, setChartData] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8082")
      .then((res) => {
        if (res.data.Status === "success") {
          setAuth(true);
          setName(res.data.name);
          const sortedInventory = res.data.inventory.sort((a, b) =>
            a.product_name.localeCompare(b.product_name)
          );
          setData(sortedInventory);
          setFilteredData(sortedInventory); // Set filteredData to sortedInventory
          generateChartData(sortedInventory);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const generateChartData = (inventoryData) => {
    const labels = [];
    const quantities = [];
    const prices = [];

    inventoryData.forEach((item) => {
      labels.push(item.product_name);
      quantities.push(item.quantity);
      prices.push(item.price);
    });

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Quantity",
          data: quantities,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Price",
          data: prices,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };

    setChartData(chartData);
  };

  useEffect(() => {
    if (chartData) {
      const existingChart = Chart.getChart("myChart");
      if (existingChart) {
        existingChart.destroy();
      }

      const ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx, {
        type: "polarArea",
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [chartData]);

  const handleLogout = () => {
    axios
      .get("http://localhost:8082/logout")
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8082/delete/" + id)
      .then((res) => {
        const updatedData = data.filter(
          (inventory) => inventory.product_id !== id
        );
        setData(updatedData);
        setFilteredData(updatedData);
        generateChartData(updatedData);
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    if (category === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.category === category);
      setFilteredData(filtered);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light ">
        <div className="container d-flex align-items-center gap-5">
          <Link className="navbar-brand " to="/">
            Inventory Management
          </Link>
          <button
            className="navbar-toggler "
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon "></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              {auth ? (
                // <div className="d-flex align-items-center gap-5">
                <>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link">
                      {name}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {auth ? (
          <div>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="m-0">Product List</h3>
                <Link to="/create" className="btn btn-success">
                  Create+
                </Link>
              </div>

              <div className="table-responsive">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ProductId</th>
                      <th>ProductName</th>
                      {/* <th>Category</th> */}
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((inventory, index) => (
                      <tr key={index}>
                        <td>{inventory.product_id}</td>
                        <td>{inventory.product_name}</td>
                        {/* <td>{inventory.category}</td> */}
                        <td>{inventory.price}</td>
                        <td>{inventory.quantity}</td>
                        <td>{inventory.total_amount}</td>
                        <td>
                          <div className="d-flex justify-content-between align-items-center">
                            <Link
                              to={`/read/${inventory.product_id}`}
                              className="btn btn-sm btn-info mr-2"
                            >
                              Read
                            </Link>
                            <Link
                              to={`/edit/${inventory.product_id}`}
                              className="btn btn-sm btn-primary mr-2"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(inventory.product_id)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="d-flex bg-light justify-content-center align-items-center responsive">
              <div className="w-100 bg-white rounded p-3 responsive">
                <h2>Dashboard</h2>
                <div className="d-flex justify-content-center responsive">
                  <div style={{ maxWidth: "700px" }}>
                    <canvas id="myChart" width="700" height="200"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3>{message}</h3>
            <h3>Login Now</h3>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
