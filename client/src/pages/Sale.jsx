import React, { useContext, useEffect, useState } from "react";
import { Card, InputNumber, Button, Select, Table, Modal, DatePicker } from "antd";
import axios from "axios";
import { TeamContext } from "../context/TeamContext";
import { CloseOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "../pages/Login.css";
import Cookies from "js-cookie";

const api_address = process.env.REACT_APP_API_ADDRESS;

const { Option } = Select;
const { RangePicker } = DatePicker;

const Sale = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sales, setSales] = useState([]);
  const { teamId, setTeamId } = useContext(TeamContext);
  const [filterDates, setFilterDates] = useState([]);
  const [sortOrder, setSortOrder] = useState("ascend");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // New state for the selected client
  // console.log(localStorage.getItem()); // This will log all cookies
  const token = localStorage.getItem('token');
  console.log('Retrieved token:', token); // Log the retrieved token

  useEffect(() => {
    const storedTeamId = localStorage.getItem("selectedTeamId");
    if (storedTeamId) setTeamId(storedTeamId);
  }, [setTeamId]);

  useEffect(() => {
    fetchClients();
    fetchInventory();
    fetchSales();
  }, [teamId]);

  const fetchClients = () => {
    const token = localStorage.getItem('token');
    // console.log(token)
    const orgId = localStorage.getItem('orgId');
    
    if (!token) {
        console.error('Token not found in cookies');
        return; // Early exit if token is not present
    }

    axios.get(`${api_address}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { orgId },
        withCredentials: true,
    })
    .then((res) => {
        setClients(res.data.items); // Assuming res.data.items contains the correct data
        console.log(res.data); // Log the fetched items
    })
    .catch((error) => {
        console.error('Error fetching clients:', error.response ? error.response.data : error.message);
    });
};




  const fetchInventory = () => {
    if (teamId) {
      axios
        .get(`${api_address}/products/inventory?team_id=${teamId}`)
        .then((res) => {
          if (res.data.success) {
            setInventory(res.data.inventory);
          }
        })
        .catch(console.error);
    }
  };

  const fetchSales = () => {
    if (teamId) {
      axios
        .get(`${api_address}/products/sales?team_id=${teamId}`)
        .then((res) => {
          if (res.data.success) {
            setSales(res.data.sales);
          }
        })
        .catch(console.error);
    }
  };

  const handleClientChange = (value) => {
    const selected = clients.find(client => client.client_name === value);
    if (selected) {
      setSelectedClient(selected.client_id); // Store the client ID
    }
  };
  

  const handleSelectChange = (value) => {
    const product = inventory.find((item) => item.product_id === value);
    if (product) {
      setSelectedItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.product_id === product.product_id
        );
        if (existingItem) {
          return prevItems.map((item) =>
            item.product_id === product.product_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSale = () => {
    setIsModalVisible(true);
  };
  const handleModalOk = async () => {
    try {
      // Validate selectedClient and selectedItems
      if (!selectedClient || selectedItems.length === 0) {
        toast.error("Please select a client and at least one item.");
        return;
      }
  
      // Prepare the items to send, ensuring that product_id is included
      const itemsToSend = selectedItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));
  
      // Step 1: Send sale data to the backend
      const saleResponse = await axios.post(`${api_address}/products/sales`, {
        items: itemsToSend, // Send items with product_id
        teamId: teamId
      }, {
        withCredentials: true
      });
  
      if (saleResponse.data.success) {
        toast.success(`Sale processed successfully! Sale ID: ${saleResponse.data.saleId}`);
  
        // Step 2: Add to the chalan_history table
        const chalanHistoryResponse = await axios.post(`${api_address}/chalan_history`, {
          client_id: selectedClient,  // Client ID from the selected client
          team_id: teamId,            // Team ID

          items: selectedItems.map(item => ({
            
            product_id: item.product_id,  // Ensure product_id is included
            quantity: item.quantity,
          })),
        }, {
          withCredentials: true
        });
        if (chalanHistoryResponse.data.success) {
          const chalanId = chalanHistoryResponse.data.chalanId; 
        console.log(chalanHistoryResponse)

          // Step 3: Insert each item into chalan_items with chalan_id
          await Promise.all(
            selectedItems.map(item => 
              axios.post(`${api_address}/chalan_items`, {
                chalan_id: chalanId,  // Use the chalan_id from chalan_history
                product_id: item.product_id,
                quantity: item.quantity
              }, {
                withCredentials: true
              })
            )
          );
  
          toast.success("Chalan history and items updated successfully!");
        } else {
          toast.error(`Failed to update chalan history: ${chalanHistoryResponse.data.message}`);
        }
      } else {
        toast.error(`Failed to process sale: ${saleResponse.data.message}`);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      toast.error("An error occurred while processing the sale.");
    } finally {
      setSelectedItems([]);
      setSelectedClient(null); // Reset the selected client
      setIsModalVisible(false);
    }
  };
  
  
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleFilterChange = (dates) => {
    setFilterDates(dates);
  };

  const filteredSales = sales.filter((sale) => {
    if (filterDates.length > 0) {
      const saleDate = moment(sale.date);
      return saleDate.isBetween(filterDates[0], filterDates[1], "day", "[]");
    }
    return true;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    const dateA = moment(a.date);
    const dateB = moment(b.date);
    return sortOrder === "ascend" ? dateA.diff(dateB) : dateB.diff(dateA);
  });

  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <InputNumber
          min={1}
          max={record.quantity}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.product_id, value)}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text, record) => (
        <span>{record.price * record.quantity}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button
          type="danger"
          icon={<CloseOutlined />}
          onClick={() => handleRemoveItem(record.product_id)}
        />
      ),
    },
  ];

  const salesColumns = [
    {
      title: "Invoice Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 30,
          marginTop: 30,
          borderBottom: "2px black solid"
        }}
      >
        <h2 style={{ marginBottom: 30 }}>Sales / Challan</h2>
      </div>

      <Select
        placeholder="Select Client"
        style={{ width: "100%" }}
        onChange={handleClientChange} // Changed to use new handler
      >
        {clients.map((item) => (
          <Option key={item.client_id} value={item.client_name}>
            {item.client_name}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Select Product"
        style={{ width: "100%" }}
        onChange={handleSelectChange}
      >
        {inventory.map((item) => (
          <Option key={item.product_id} value={item.product_id}>
            {item.product_name}
          </Option>
        ))}
      </Select>

      <Table
        dataSource={selectedItems}
        columns={productColumns}
        rowKey="product_id"
        scroll={{ x: 400 }}
        pagination={false}
        footer={() => (
          <div style={{ textAlign: "right" }}>
            <strong>Total Amount: {calculateTotalAmount()}</strong>
          </div>
        )}
      />
      <Button
        type="primary"
        style={{ marginTop: 20 }}
        onClick={handleSale}
        disabled={selectedItems.length === 0}
      >
        Process Sale
      </Button>
      <ToastContainer />

      <Modal
        title="Confirm Sale"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <p>Are you sure you want to process the following items?</p>
        <ul>
          {selectedItems.map(item => (
            <li key={item.product_id}>
              {item.product_name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
};

export default Sale;
