import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Input } from "antd";
import axios from "axios";
import { TeamContext } from "../context/TeamContext";

const api_address = process.env.REACT_APP_API_ADDRESS;
const AddItemModal = ({ isVisible, handleClose }) => {
  const [formValues, setFormValues] = useState({
    product_name: "",
    category: "",
    price: "",
    quantity: "",
    total_amount: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { teamId } = useContext(TeamContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.product_name)
      errors.product_name = "Product name is required";
    if (!formValues.category) errors.category = "Category is required";
    if (!formValues.price) errors.price = "Price is required";
    if (!formValues.quantity) errors.quantity = "Quantity is required";
    if (!formValues.total_amount)
      errors.total_amount = "Total amount is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItem = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post(`${api_address}/products`, {
          ...formValues,
          team_id: teamId,
        });
        if (response.data.success) {
          // Update items list, clear form, and close modal
          // You might need to fetch the updated items list here
          handleClose();
        }
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  return (
    <Modal
      title="Add New Item"
      open={isVisible}
      onCancel={handleClose}
      footer={[
        <button key="cancel" onClick={handleClose}>
          Cancel
        </button>,
        <button key="submit" type="primary" onClick={handleAddItem}>
          Add Item
        </button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item
          label="Product Name"
          validateStatus={formErrors.product_name ? "error" : ""}
          help={formErrors.product_name}
          rules={[{ required: true, message: "Please enter an Product name" }]}
        >
          <Input
            name="product_name"
            value={formValues.product_name}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          label="Category"
          validateStatus={formErrors.category ? "error" : ""}
          help={formErrors.category}
          rules={[{ required: true, message: "Please enter an Product category" }]}
        >
          <Input
            name="category"
            value={formValues.category}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          label="Price"
          validateStatus={formErrors.price ? "error" : ""}
          help={formErrors.price}
          rules={[{ required: true, message: "Please enter an Product price" }]}
        >
          <Input
            name="price"
            type="number"
            value={formValues.price}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          label="Quantity"
          validateStatus={formErrors.quantity ? "error" : ""}
          help={formErrors.quantity}
          rules={[{ required: true, message: "Please enter an Product Quantity" }]}
        >
          <Input
            name="quantity"
            type="number"
            value={formValues.quantity}
            onChange={handleInputChange}
          />
        </Form.Item>
        <Form.Item
          label="Total Amount"
          validateStatus={formErrors.total_amount ? "error" : ""}
          help={formErrors.total_amount}
          rules={[{ required: true, message: "Please enter an Total" }]}
        >
          <Input
            name="total_amount"
            type="number"
            value={formValues.total_amount}
            onChange={handleInputChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddItemModal;
