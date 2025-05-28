import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Table, Space, message } from 'antd';
import axios from 'axios';
import { config } from '../../config';

const UserForm = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

 const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching from:', config.endpoints.users); // Debug URL
      const response = await axios.get(config.endpoints.users);
      console.log('Response:', response.data); // Debug data
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        message.error('Invalid data format received');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error(`Failed to fetch users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      if (editingId) {
        await axios.put(`${config.endpoints.users}/${editingId}`, values);
        message.success('User updated successfully');
        setEditingId(null);
      } else {
        const response = await axios.post(config.endpoints.users, values);
        console.log('Response:', response.data); // Debug response
        message.success('User created successfully');
      }
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('Error details:', error.response?.data); // Log detailed error
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingId(record._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.endpoints.users}/${id}`);
      message.success('User deleted successfully');
      fetchUsers();2
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto' }}>
      <Card title={editingId ? "Edit User" : "Add User"} style={{ marginBottom: 20 }}>
        <Form
          form={form}
          name="userForm"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card title="Users List">
        <Table
          loading={loading}
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default UserForm;
