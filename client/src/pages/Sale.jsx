import React, { useContext, useEffect, useState } from "react";
import { InputNumber, Select, Button, Table, Modal } from "antd";
import axios from "axios";
import { TeamContext } from "../context/TeamContext";
import { CloseOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../pages/Login.css";

const api_address = process.env.REACT_APP_API_ADDRESS;
const { Option } = Select;

const Sale = () => {
    const [inventory, setInventory] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sales, setSales] = useState([]);
    const { teamId, setTeamId } = useContext(TeamContext);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    
    // State to track insufficient items
    const [insufficientItems, setInsufficientItems] = useState([]); 

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
        const token = localStorage.getItem("token");
        const orgId = localStorage.getItem("orgId");

        if (!token) {
            console.error("Token not found");
            return;
        }

        axios
            .get(`${api_address}/api/clients`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { orgId },
                withCredentials: true,
            })
            .then((res) => {
                setClients(res.data.items);
            })
            .catch((error) => {
                console.error("Error fetching clients:", error.response?.data || error.message);
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
        const selected = clients.find((client) => client.client_name === value);
        if (selected) {
            setSelectedClient(selected.client_id);
        }
    };

    const handleSelectChange = (value) => {
        const product = inventory.find((item) => item.product_id === value);
        if (product) {
            setSelectedItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.product_id === product.product_id);
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
        if (quantity !== undefined && quantity !== null) {
            setSelectedItems((prevItems) =>
                prevItems.map((item) =>
                    item.product_id === productId
                        ? { ...item, quantity: Math.max(1, quantity) }
                        : item
                )
            );
        }
    };

    const handlePriceChange = (productId, price) => {
        if (price !== undefined && price !== null) {
            setSelectedItems((prevItems) =>
                prevItems.map((item) =>
                    item.product_id === productId
                        ? { ...item, price: price }
                        : item
                )
            );
        }
    };

    const handleRemoveItem = (productId) => {
        setSelectedItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
    };

    const calculateTotalAmount = () => {
        return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleSale = () => {
      // Check if any items are selected
      if (selectedItems.length === 0) {
          toast.error("Please select at least one item to confirm the sale."); // Show error toast for no selected items
          return; // Early return, no need to proceed
      }

      // Check for insufficient quantity before opening the modal
      const insufficientItems = selectedItems.filter(item => {
          const inventoryItem = inventory.find(inv => inv.product_id === item.product_id);
          return inventoryItem && item.quantity > inventoryItem.quantity; // Compare selected quantity with available inventory
      });

      if (insufficientItems.length > 0) {
          setInsufficientItems(insufficientItems); // Set the items with insufficient quantity
          toast.error("Some items have insufficient stock."); // Show error toast
      } else {
          setIsModalVisible(true); // No issues, open the modal
      }
  };

    const handleModalOk = async () => {
        try {
            // Check if client and items are selected
            if (!selectedClient || selectedItems.length === 0) {
                toast.error("Please select a client and at least one item.");
                return;
            }

            // If there are insufficient items, just return (no need to check again, we already checked)
            if (insufficientItems.length > 0) {
                return; 
            }

            // If no issues, proceed with sale
            const itemsToSend = selectedItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            }));

            const saleResponse = await axios.post(
                `${api_address}/products/sales`,
                {
                    items: itemsToSend,
                    teamId: teamId,
                },
                {
                    withCredentials: true,
                }
            );

            if (saleResponse.data.success) {
                toast.success(`Sale processed successfully! Sale ID: ${saleResponse.data.saleId}`);

                const chalanHistoryResponse = await axios.post(
                    `${api_address}/chalan_history`,
                    {
                        client_id: selectedClient,
                        team_id: teamId,
                        items: itemsToSend,
                    },
                    {
                        withCredentials: true,
                    }
                );

                if (chalanHistoryResponse.data.success) {
                    const chalanId = chalanHistoryResponse.data.chalanId;

                    await Promise.all(
                        itemsToSend.map((item) =>
                            axios.post(
                                `${api_address}/chalan_items`,
                                {
                                    chalan_id: chalanId,
                                    product_id: item.product_id,
                                    quantity: item.quantity,
                                },
                                {
                                    withCredentials: true,
                                }
                            )
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
            console.error("Error:", error.response?.data || error.message);
            toast.error("An error occurred while processing the sale.");
        } finally {
            setSelectedItems([]);
            setSelectedClient(null);
            setIsModalVisible(false);
            setInsufficientItems([]); // Reset insufficient items state
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setInsufficientItems([]); // Reset insufficient items state
    };

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
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.product_id, value)}
                    style={{
                        width: "100%",
                        border: (insufficientItems.find(item => item.product_id === record.product_id)) ? '2px solid red' : '1px solid #d9d9d9'
                    }}
                />
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (text, record) => (
                <InputNumber
                    min={0}
                    value={record.price}
                    onChange={(value) => handlePriceChange(record.product_id, value)}
                    style={{ width: "100%" }}
                />
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (text, record) => <span>{record.price * record.quantity}</span>,
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

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 30,
                    marginTop: 30,
                    borderBottom: "2px black solid",
                }}
            >
                <h2 style={{ marginBottom: 30 }}>Sales / Challan</h2>
            </div>

            <Select
                showSearch
                placeholder="Select Client"
                style={{ width: "100%", marginBottom: 20 }}
                onChange={handleClientChange}
                optionFilterProp="children"
            >
                {clients.map((item) => (
                    <Option key={item.client_id} value={item.client_name}>
                        {item.client_name}
                    </Option>
                ))}
            </Select>

            <Select
                showSearch
                placeholder="Select Product"
                style={{ width: "100%", marginBottom: 20 }}
                onChange={handleSelectChange}
                optionFilterProp="children"
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
                pagination={false}
                rowKey="product_id"
            />

            <div style={{ marginTop: 20 }}>
                <button
                    type="primary"
                    onClick={handleSale}
                    style={{ marginRight: 10 }}
                >
                    Confirm Sale
                </button>
                <span style={{ fontWeight: "bold" }}>
                    Total Amount: {calculateTotalAmount()} INR
                </span>
            </div>

            <Modal
                title="Confirm Sale"
                open={isModalVisible}
                footer={[
                    <button key="confirm" type="primary" onClick={handleModalOk}>
                        Confirm
                    </button>,
                    <button key="cancel" type="default" onClick={handleModalCancel}>
                        Cancel
                    </button>,
                ]}
                onCancel={handleModalCancel}
            >
                <p>Total Amount: {calculateTotalAmount()} INR</p>
                <p>Are you sure you want to confirm this sale?</p>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default Sale;
