import React, { useContext, useEffect, useState } from "react";
import { Card, InputNumber, Button, Select, Table, Modal, DatePicker } from "antd";
import axios from "axios";
import { TeamContext } from "../context/TeamContext";
import { CloseOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "../pages/Login.css";
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
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedTeamId = localStorage.getItem("selectedTeamId");
    if (storedTeamId) setTeamId(storedTeamId);
  }, [setTeamId]);

  useEffect(() => {
    fetchInventory();
    fetchSales();
  }, [teamId]);

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

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(`${api_address}/products`)
      .then((res) => {
        if (res.data.success === true) {
          setAuth(true);
          const sortedInventory = res.data.items.sort((a, b) =>
            a.product_name.localeCompare(b.product_name)
          );
          
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  
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
      console.log("Sending data:", {
        items: selectedItems,
        teamId: teamId
      });
  
      const response = await axios.post(`${api_address}/products/sales`, {
        items: selectedItems,
        teamId: teamId
      }, {
        withCredentials: true
      });
  
      console.log("Response:", response.data);
  
      if (response.data.success) {
        toast.success(`Sale processed successfully! Sale ID: ${response.data.saleId}`);
      } else {
        toast.error(`Failed to process sale: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      toast.error("An error occurred while processing the sale.");
    } finally {
      setSelectedItems([]);
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
    <div >

      <Card title="Sales Management" className="square-form">
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
      </Card>

      {/* <Card title="Sales History" className="square-form" style={{ marginTop: 20 }}>
        <RangePicker onChange={handleFilterChange} />
        <Table
          dataSource={sortedSales}
          columns={salesColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          onChange={(pagination, filters, sorter) =>
            setSortOrder(sorter.order)
          }
        />
      </Card> */}

<Modal
      title="Confirm Sale"
      visible={isModalVisible}
      onOk={handleModalOk}
      onCancel={() => setIsModalVisible(false)}
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
