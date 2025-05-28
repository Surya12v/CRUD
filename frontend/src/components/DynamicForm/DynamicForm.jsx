import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, Card, message, InputNumber, DatePicker, Select, Table, Space } from 'antd';
import axios from 'axios';
import { config } from '../../config';

const DynamicForm = () => {
  const { collectionName } = useParams();
  const [form] = Form.useForm();
  const [schema, setSchema] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  useEffect(() => {
    fetchSchema();
    fetchData();
  }, [collectionName]);

  const fetchSchema = async () => {
    try {
      setLoading(true);
      console.log('Fetching schema for:', collectionName); // Debug
      const response = await axios.get(`${config.endpoints.formBuilder}/${collectionName}`);
      
      if (!response.data || !response.data.schema) {
        throw new Error('Invalid schema format');
      }
      
      setSchema(response.data.schema);
    } catch (error) {
      console.error('Schema fetch error:', error);
      message.error(error.response?.data?.message || 'Failed to fetch form schema');
      setSchema([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setTableLoading(true);
      const response = await axios.get(`${config.endpoints.dynamic}/${collectionName}`);
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setTableLoading(false);
    }
  };

  const handleEdit = (record) => {
    // Convert date strings to dayjs objects for DatePicker
    const formattedRecord = { ...record };
    schema.forEach(field => {
      if (field.type === 'date' && record[field.field]) {
        formattedRecord[field.field] = dayjs(record[field.field]);
      }
    });
    form.setFieldsValue(formattedRecord);
  };

  const onFinish = async (values) => {
    try {
      // Convert dayjs objects to ISO strings for API
      const formattedValues = { ...values };
      schema.forEach(field => {
        if (field.type === 'date' && values[field.field]) {
          formattedValues[field.field] = values[field.field].toISOString();
        }
      });
      
      await axios.post(`${config.endpoints.dynamic}/${collectionName}`, formattedValues);
      message.success('Data saved successfully');
      form.resetFields();
      fetchData(); // Refresh table after save
    } catch (error) {
      message.error('Failed to save data');
    }
  };

  // 1. Schema to Form Items Renderer
  const renderFormItem = (field) => {
    switch (field.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'date':
        return <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />;
      case 'email':
        return <Input type="email" />;
      case 'select':
        return (
          <Select>
            {field.options.map(opt => (
              <Select.Option key={opt} value={opt}>{opt}</Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input />;
    }
  };

  // 2. Schema to Table Columns Converter
  const getColumns = () => {
    const columns = schema.map(field => ({
      title: field.label,
      dataIndex: field.field,
      key: field.field
    }));

    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      )
    });

    return columns;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.endpoints.dynamic}/${collectionName}/${id}`);
      message.success('Record deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete record');
    }
  };

  // 3. Form and Table Rendering
  return (
    <div>
      <Card title={`${collectionName} Form`} loading={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Map schema to Form.Items */}
          {schema.map((field) => (
            <Form.Item
              key={field.field}
              name={field.field}
              label={field.label}
              rules={[{ required: field.required, message: `${field.label} is required` }]}
            >
              {renderFormItem(field)}
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* <Card title={`${collectionName} Data`} style={{ marginTop: 16 }}>
        <Table
          loading={tableLoading}
          columns={getColumns()}
          dataSource={data}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </Card> */}
    </div>
  );
};

export default DynamicForm;
