import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "antd";

export const Home = () => {
  const [data, setData] = useState([]);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8082/products")
      .then((res) => {
        console.log(res.data)
        if (res.data.success === true) {
          setAuth(true);
          const sortedInventory = res.data.items.sort((a, b) =>
            a.product_name.localeCompare(b.product_name)
          );
          setData(sortedInventory);
          setFilteredData(sortedInventory);
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err.response.data); // Log the error response data
        console.error(err); // Log the full error object for further investigation
      });
      
      
  }, []);


  const handleLogout = () => {
    axios
      .get("http://localhost:8082/logout")
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  return (
    <div>
      <div className="container mt-4">
        {auth ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxHeight: "calc(80vh - 64px)",
          }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                height: "calc(100vh - 64px)"
              }}
            >
              <h2>Item List</h2>
              <Button href="/create">+ Add Item</Button>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Card className="mb-3" style={{ width: "100%", border: "none",  height: "calc(77vh - 64px)", overflowY: "auto" }}>
                <div className="table-responsive">
                  <table>
                    <tbody>
                      {filteredData.map((inventory, index) => (
                        <tr key={index} onClick={() => navigate(`/read/${inventory.product_id}`)} style={{ cursor: "pointer" }}>
                          <td>{inventory.product_name}</td>
                          <td>{inventory.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card className="mb-3" style={{ width: "100%", border: "none", height: "calc(77vh - 64px)", overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ padding: "24px",paddingTop:'103px', color: "#ccc", textAlign: "center" }}>
                  To view inventory details,<br/> you can group items
                  by attribute or <br/>select them individually from the list on the left.
                </div>
              </Card>
            </div>
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
    </div>
  );
};
