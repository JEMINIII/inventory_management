import React, { useEffect, useState } from "react";
import { Button, Card, InputNumber } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function StockIn() {

    const [data, setData] = useState([]);
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
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
      
      const handleItemClick = (inventory) => {
        const existingItemIndex = selectedItems.findIndex(item => item.product_id === inventory.product_id);
        if (existingItemIndex !== -1) {
            const updatedItems = [...selectedItems];
            updatedItems[existingItemIndex].quantity++;
            setSelectedItems(updatedItems);
        } else {
            setSelectedItems([...selectedItems, { ...inventory, quantity: 1 }]);
        }
    };
    
    const handleQuantityChange = (productId, quantity) => {
        const updatedItems = selectedItems.map(item =>
            item.product_id === productId ? { ...item, quantity } : item
        );
        setSelectedItems(updatedItems);
    };
    
    

    const handleUpdateClick = () => {
        selectedItems.forEach(item => {
          const existingItem = data.find(i => i.product_id === item.product_id);
          const inventoryQuantity = existingItem ? existingItem.quantity : 0;
          axios.put('http://localhost:8082/products/updateQuantity', { productId: item.product_id, quantity: inventoryQuantity - item.quantity })
              .then(res => {
                  console.log('Quantity updated successfully');
              })
              .catch(err => {
                  console.error('Failed to update quantity:', err);
              });
        });
        window.location.reload()
    };
    

    return (
      <div>
      <div className="container mt-4">
        {auth ?(
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
              <h2>Stock Out</h2>
              
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Card className="mb-3" style={{ width: "100%", border: "none",  height: "calc(77vh - 64px)", overflowY: "auto" }}>
                <div className="table-responsive">
                  <table>
                    <tbody>
                      {filteredData.map((inventory, index) => (
                        <tr key={index} onClick={() => handleItemClick(inventory)} style={{ cursor: "pointer" }}>
                          <td>{inventory.product_name}</td>
                          <td>{inventory.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card className="mb-3" style={{ width: "100%", border: "none", height: "calc(77vh - 64px)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {selectedItems.length > 0 ? (
                  <div style={{ padding: "24px", color: "black" }}>
                    <h5>Selected Items:</h5>
                    <br/>
                    {selectedItems.map(item => {
                      const existingItem = data.find(i => i.product_id === item.product_id);
                      const inventoryQuantity = existingItem ? existingItem.quantity : 0;
                      return (
                        <div key={item.product_id} style={{ marginBottom: "16px" }}>
                          <p>{item.product_name}</p>
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(value) => handleQuantityChange(item.product_id, value)}
                          />
                          <p>Inventory Quantity: {inventoryQuantity - item.quantity}</p>
                        </div>
                      );
                    })}
                    <Button type="primary" onClick={handleUpdateClick}>Update</Button>
                  </div>
                ) : (
                  <div style={{ padding: "24px", paddingTop: "103px", color: "#ccc", textAlign: "center" }}>
                    To view inventory details,<br/> you can group items
                    by attribute or <br/>select them individually from the list on the left.
                  </div>
                )}
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

    )
}

export default StockIn;
