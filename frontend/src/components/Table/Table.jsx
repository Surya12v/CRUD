import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Card, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

const DynamicTable = () => {
  const { collectionName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchema();
    fetchData();
  }, [collectionName]);

  const fetchSchema = async () => {
    try {
      const response = await axios.get(`${config.endpoints.formBuilder}/${collectionName}`);
      setSchema(response.data.schema);
    } catch (error) {
      message.error('Failed to fetch schema');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.endpoints.dynamic}/${collectionName}`);
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
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

  const getColumns = () => {
    const columns = schema.map(field => ({
      title: field.label,
      dataIndex: field.field,
      key: field.field,
      render: (text, record) => {
        if (field.type === 'date') {
          return new Date(text).toLocaleDateString();
        }
        return text;
      }
    }));

    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/dynamic/${collectionName}/${record._id}`)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </Space>
      )
    });

    return columns;
  };

  return (
    <Card
      title={`${collectionName} Records`}
      extra={
        <Button type="primary" onClick={() => navigate(`/dynamic/${collectionName}`)}>
          New Record
        </Button>
      }
    >
      <Table
        loading={loading}
        columns={getColumns()}
        dataSource={data}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default DynamicTable;
