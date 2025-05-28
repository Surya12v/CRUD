import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Select, Space, Switch, message, Table } from 'antd';
import axios from 'axios';
import { config } from '../../config';

const { Option } = Select;

const FormBuilder = () => {
  const [formConfig, setFormConfig] = useState({
    collectionName: '',
    schema: []
  });
  const [savedForms, setSavedForms] = useState([]);
  const [loading, setLoading] = useState(false);

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
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
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

      if (formConfig._id) {
        // Update existing form
        await axios.put(`${config.endpoints.formBuilder}/${formConfig._id}`, formConfig);
        message.success('Form configuration updated successfully');
      } else {
        // Create new form
        await axios.post(config.endpoints.formBuilder, formConfig);
        message.success('Form configuration saved successfully');
      }
      
      fetchSavedForms();
      setFormConfig({ collectionName: '', schema: [] });
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <>
      <Card title="Form Builder">
        <Form layout="vertical">
          <Form.Item label="Collection Name" required>
            <Input 
              value={formConfig.collectionName}
              placeholder="Enter collection name"
              onChange={(e) => setFormConfig({...formConfig, collectionName: e.target.value})}
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
                    onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(','))}
                  />
                )}
              </Space>
            </Card>
          ))}

          <Space>
            <Button type="dashed" onClick={addField}>Add Field</Button>
            <Button type="primary" onClick={saveFormConfig}>Save Form Configuration</Button>
          </Space>
        </Form>
      </Card>

      {/* <Card title="Saved Form Configurations" style={{ marginTop: 16 }}>
        <Table
          loading={loading}
          dataSource={savedForms}
          columns={columns}
          rowKey="_id"
        />
      </Card> */}
    </>
  );
};

export default FormBuilder;
