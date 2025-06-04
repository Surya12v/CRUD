import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  message, 
  InputNumber, 
  DatePicker, 
  Select, 
  Space, 
  Table, 
  Typography,
  Row,
  Col,
  Divider,
  Badge,
  Tooltip,
  Empty,
  Spin
} from 'antd';
import { 
  SaveOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined, 
  PlusOutlined,
  FormOutlined,
  TableOutlined,
  UserOutlined,
  CalendarOutlined,
  NumberOutlined,
  MailOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { config } from '../../config';

const { Title, Text } = Typography;

const DynamicForm = () => {
  const { collectionName, id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [schema, setSchema] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSchema();
    fetchData();
    if (id) {
      fetchRecord();
    } else {
      form.resetFields();
    }
  }, [collectionName, id]);

  const fetchSchema = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.endpoints.formBuilder}/${collectionName}`);
      if (!response.data || !response.data.schema) {
        throw new Error('Invalid schema format');
      }
      setSchema(response.data.schema);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch form schema');
      setSchema([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecord = async () => {
    try {
      const response = await axios.get(`${config.endpoints.dynamic}/${collectionName}/${id}`);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Failed to fetch record');
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
    navigate(`/dynamic/${collectionName}/${record._id}`);
  };

  const handleBack = () => navigate(`/table/${collectionName}`);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      const endpoint = `${config.endpoints.dynamic}/${collectionName}${id ? `/${id}` : ''}`;
      const method = id ? 'put' : 'post';
      await axios[method](endpoint, values);
      message.success({
        content: `Record ${id ? 'updated' : 'created'} successfully!`,
        duration: 3,
        style: { marginTop: '20px' }
      });
      navigate(`/table/${collectionName}`);
    } catch (error) {
      message.error({
        content: 'Operation failed. Please try again.',
        duration: 4
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(`${config.endpoints.dynamic}/${collectionName}/${recordId}`);
      message.success('Record deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete record');
    }
  };

  const getFieldIcon = (type) => {
    switch (type) {
      case 'number':
        return <NumberOutlined style={{ color: '#1890ff' }} />;
      case 'date':
        return <CalendarOutlined style={{ color: '#52c41a' }} />;
      case 'email':
        return <MailOutlined style={{ color: '#722ed1' }} />;
      case 'select':
        return <UnorderedListOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <FormOutlined style={{ color: '#13c2c2' }} />;
    }
  };

  const renderFormItem = (field) => {
    const baseStyle = { 
      width: '100%',
      borderRadius: '8px',
      fontSize: '14px'
    };

    switch (field.type) {
      case 'number':
        return (
          <InputNumber 
            style={baseStyle} 
            placeholder={`Enter ${field.label.toLowerCase()}`}
            size="large"
          />
        );
      case 'date':
        return (
          <DatePicker 
            style={baseStyle} 
            format="YYYY-MM-DD" 
            placeholder={`Select ${field.label.toLowerCase()}`}
            size="large"
          />
        );
      case 'email':
        return (
          <Input 
            type="email" 
            style={baseStyle}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
            size="large"
          />
        );
      case 'select':
        return (
          <Select 
            style={baseStyle}
            placeholder={`Select ${field.label.toLowerCase()}`}
            size="large"
          >
            {field.options?.map(opt => (
              <Select.Option key={opt} value={opt}>{opt}</Select.Option>
            ))}
          </Select>
        );
      default:
        return (
          <Input 
            style={baseStyle}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            size="large"
          />
        );
    }
  };

  const getColumns = () => {
    const columns = schema.map(field => ({
      title: (
        <Space>
          {getFieldIcon(field.type)}
          <Text strong>{field.label}</Text>
        </Space>
      ),
      dataIndex: field.field,
      key: field.field,
      render: (text, record) => {
        if (field.type === 'date' && text) {
          return dayjs(text).format('MMM DD, YYYY');
        }
        if (field.type === 'email') {
          return <Text code>{text}</Text>;
        }
        return text;
      }
    }));

    columns.push({
      title: <Text strong>Actions</Text>,
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit record">
            <Button 
              type="primary" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ borderRadius: '6px' }}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete record">
            <Button 
              danger 
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
              style={{ borderRadius: '6px' }}
            >
              Delete
            </Button>
          </Tooltip>
        </Space>
      )
    });

    return columns;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col span={24}>
            <Card 
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none'
              }}
            >
              <Row align="middle" justify="space-between">
                <Col>
                  <Space size="large">
                    <div style={{
                      background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FormOutlined style={{ fontSize: '24px', color: 'white' }} />
                    </div>
                    <div>
                      <Title level={2} style={{ margin: 0, color: '#262626' }}>
                        {collectionName?.charAt(0).toUpperCase() + collectionName?.slice(1)} Form
                      </Title>
                      <Text type="secondary" style={{ fontSize: '16px' }}>
                        {id ? 'Edit existing record' : 'Create new record'}
                      </Text>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Button 
                    size="large"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    style={{ 
                      borderRadius: '8px',
                      height: '40px'
                    }}
                  >
                    Back to List
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Form Section */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <Space>
                  <FormOutlined style={{ color: '#1890ff' }} />
                  <Text strong style={{ fontSize: '18px' }}>
                    {id ? 'Edit Record' : 'Create New Record'}
                  </Text>
                </Space>
              }
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: 'none',
                height: 'fit-content'
              }}
              bodyStyle={{ padding: '32px' }}
            >
              {schema.length === 0 ? (
                <Empty 
                  description="No form fields configured"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Form 
                  form={form} 
                  layout="vertical" 
                  onFinish={onFinish}
                  size="large"
                  requiredMark={false}
                >
                  {schema.map((field, index) => (
                    <React.Fragment key={field.field}>
                      <Form.Item
                        name={field.field}
                        label={
                          <Space>
                            {getFieldIcon(field.type)}
                            <Text strong style={{ fontSize: '15px' }}>
                              {field.label}
                            </Text>
                            {field.required && (
                              <Badge 
                                count="Required" 
                                style={{ 
                                  backgroundColor: '#ff4d4f',
                                  fontSize: '10px',
                                  height: '18px',
                                  lineHeight: '18px'
                                }} 
                              />
                            )}
                          </Space>
                        }
                        rules={[
                          { 
                            required: field.required, 
                            message: `Please enter ${field.label.toLowerCase()}` 
                          }
                        ]}
                        style={{ marginBottom: '24px' }}
                      >
                        {renderFormItem(field)}
                      </Form.Item>
                      {index < schema.length - 1 && (
                        <Divider style={{ margin: '16px 0', borderColor: '#f0f0f0' }} />
                      )}
                    </React.Fragment>
                  ))}
                  
                  <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      loading={submitting}
                      size="large"
                      icon={id ? <SaveOutlined /> : <PlusOutlined />}
                      style={{ 
                        width: '100%',
                        height: '48px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                        border: 'none'
                      }}
                    >
                      {id ? 'Update Record' : 'Create Record'}
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>

          
        </Row>
      </div>

      <style jsx>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
        .ant-table-thead > tr > th {
          background-color: #f8f9fa;
          border-bottom: 2px solid #e9ecef;
          font-weight: 600;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #e8f4fd !important;
        }
        .ant-form-item-label > label {
          font-weight: 500;
        }
        .ant-input:focus,
        .ant-input-focused,
        .ant-input-number:focus,
        .ant-input-number-focused,
        .ant-picker:focus,
        .ant-picker-focused,
        .ant-select:focus,
        .ant-select-focused {
          border-color: #722ed1;
          box-shadow: 0 0 0 2px rgba(114, 46, 209, 0.2);
        }
      `}</style>
    </div>
  );
};

export default DynamicForm;