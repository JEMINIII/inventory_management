import React, { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import axios from "axios";

const CreateOrganization = ({ onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const api_address = process.env.REACT_APP_API_ADDRESS;

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);
      const response = await axios.post(
        `${api_address}/create_org`,
        { name: values.orgName, description: values.orgDescription },
        { withCredentials: true }
      );

      if (response.status === 201 && response.data.success) {
        message.success("Organization created successfully!");
        form.resetFields();
        onCreate(response.data.organization);
      } else {
        message.error("Failed to create the organization.");
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error || "Error creating organization.");
      } else {
        message.error("Error creating the organization. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create Organization"
      visible={true}
      onCancel={onCancel}
      confirmLoading={loading}
      footer={[
        <button key="create" type="primary" onClick={handleFormSubmit} loading={loading}>
          Create
        </button>,
      ]}
    >
      <Form form={form} layout="vertical" name="create_org">
        <Form.Item
          name="orgName"
          label="Organization Name"
          rules={[{ required: true, message: "Please enter an organization name" }]}
        >
          <Input placeholder="Enter organization name" />
        </Form.Item>
        <Form.Item
          name="orgDescription"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea placeholder="Enter organization description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrganization;
