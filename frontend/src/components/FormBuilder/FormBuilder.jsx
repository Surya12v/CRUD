import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, Space, Switch, message, Table, Typography, Popconfirm } from 'antd';
import axios from 'axios';
import { config } from '../../config';

const { Option } = Select;
const { Title } = Typography;

const FormBuilder = () => {
  const [formConfig, setFormConfig] = useState({
    collectionName: '',
    schema: []
  });
  const [savedForms, setSavedForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('list'); // 'list' | 'add' | 'edit'

  const fieldTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Email', value: 'email' },
    { label: 'Select', value: 'select' },
    { label: 'Date', value: 'date' },
    { label: 'Textarea', value: 'textarea' }
  ];

  useEffect(() => {
    fetchSavedForms();
  }, []);

  const fetchSavedForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(config.endpoints.formBuilder);
      setSavedForms(response.data);
    } catch (error) {
      message.error('Failed to fetch saved forms');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Collection Name',
      dataIndex: 'collectionName',
      key: 'collectionName',
    },
    {
      title: 'Fields Count',
      dataIndex: 'schema',
      key: 'fieldsCount',
      render: (schema) => schema.length
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this form configuration?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  const addField = () => {
    setFormConfig({
      ...formConfig,
      schema: [
        ...formConfig.schema,
        {
          field: '',
          type: 'text',
          label: '',
          required: false,
          options: []
        }
      ]
    });
  };

  const handleFieldChange = (index, key, value) => {
    const newSchema = [...formConfig.schema];
    newSchema[index][key] = value;
    setFormConfig({ ...formConfig, schema: newSchema });
  };

  const handleEdit = (record) => {
    setFormConfig(record);
    setMode('edit');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.endpoints.formBuilder}/${id}`);
      message.success('Form configuration deleted');
      fetchSavedForms();
    } catch (error) {
      message.error('Failed to delete form configuration');
    }
  };

  const saveFormConfig = async () => {
    try {
      if (!formConfig.collectionName) {
        return message.error('Collection name is required');
      }
      if (formConfig.schema.length === 0) {
        return message.error('At least one field is required');
      }
      // Validate schema fields
      const invalidFields = formConfig.schema.filter(
        field => !field.field || !field.label || !field.type
      );
      if (invalidFields.length > 0) {
        return message.error('All fields must have name, label and type');
      }
      const endpoint = formConfig._id 
        ? `${config.endpoints.formBuilder}/${formConfig._id}`
        : config.endpoints.formBuilder;
      const method = formConfig._id ? 'put' : 'post';
      await axios[method](endpoint, formConfig);
      message.success(`Form configuration ${formConfig._id ? 'updated' : 'saved'} successfully`);
      fetchSavedForms();
      setFormConfig({ collectionName: '', schema: [] });
      setMode('list');
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleAddNew = () => {
    setFormConfig({ collectionName: '', schema: [] });
    setMode('add');
  };

  const handleBack = () => {
    setFormConfig({ collectionName: '', schema: [] });
    setMode('list');
  };

  // --- UI ---
  if (mode === 'list') {
    return (
      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>Form Configurations</Title>
            <Button type="primary" onClick={handleAddNew}>Add New Form</Button>
          </Space>
        }
      >
        <Table
          loading={loading}
          dataSource={savedForms}
          columns={columns}
          rowKey="_id"
        />
      </Card>
    );
  }

  // Add/Edit mode
  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {mode === 'edit' ? 'Edit Form Configuration' : 'Add New Form Configuration'}
          </Title>
          <Button onClick={handleBack}>Back to List</Button>
        </Space>
      }
    >
      <Form layout="vertical">
        <Form.Item label="Collection Name" required>
          <Input 
            value={formConfig.collectionName}
            placeholder="Enter collection name"
            onChange={(e) => setFormConfig({...formConfig, collectionName: e.target.value})}
            disabled={!!formConfig._id}
          />
        </Form.Item>

        {formConfig.schema.map((field, index) => (
          <Card key={index} size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                placeholder="Field name"
                value={field.field}
                onChange={(e) => handleFieldChange(index, 'field', e.target.value)}
              />
              <Input
                placeholder="Label"
                value={field.label}
                onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
              />
              <Select
                value={field.type}
                onChange={(value) => handleFieldChange(index, 'type', value)}
                style={{ width: '100%' }}
              >
                {fieldTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
              <Space>
                <span>Required:</span>
                <Switch
                  checked={field.required}
                  onChange={(checked) => handleFieldChange(index, 'required', checked)}
                />
              </Space>
              {field.type === 'select' && (
                <Input
                  placeholder="Options (comma-separated)"
                  value={field.options?.join(',')}
                  onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(','))}
                />
              )}
            </Space>
          </Card>
        ))}

        <Space>
          <Button type="dashed" onClick={addField}>Add Field</Button>
          <Button type="primary" onClick={saveFormConfig}>
            {mode === 'edit' ? 'Update' : 'Save'} Form Configuration
          </Button>
        </Space>
      </Form>
    </Card>
  );
};

export default FormBuilder;
