import React, { useState, useEffect } from 'react';
import { 
  Layout as AntLayout, 
  Menu, 
  Typography, 
  Avatar, 
  Space, 
  Badge, 
  Dropdown,
  Button,
  Divider,
  Tooltip,
  Card
} from 'antd';
import { 
  FormOutlined,
  DatabaseOutlined,
  TableOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  SearchOutlined,
  HomeOutlined,
  PlusOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

const { Header, Content, Sider } = AntLayout;
const { Title, Text } = Typography;

const Layout = ({ children }) => {
  // State Management
  const [collections, setCollections] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Data Fetching
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(config.endpoints.formBuilder);
      setCollections(response.data || []);
    } catch (error) {
      console.error('Failed to fetch collections');
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  // Get current page info
  const getCurrentPageInfo = () => {
    const path = location.pathname;
    if (path === '/forms' || path === '/') {
      return { title: 'Form Builder', icon: <FormOutlined />, description: 'Create and manage dynamic forms' };
    }
    if (path.includes('/table/')) {
      const collectionName = path.split('/table/')[1];
      return { 
        title: `${collectionName?.charAt(0).toUpperCase() + collectionName?.slice(1)} Records`, 
        icon: <TableOutlined />, 
        description: `View and manage ${collectionName} data` 
      };
    }
    if (path.includes('/dynamic/')) {
      const collectionName = path.split('/dynamic/')[1].split('/')[0];
      const isEdit = path.split('/').length > 3;
      return { 
        title: `${isEdit ? 'Edit' : 'Create'} ${collectionName?.charAt(0).toUpperCase() + collectionName?.slice(1)}`, 
        icon: <FormOutlined />, 
        description: `${isEdit ? 'Update existing' : 'Add new'} ${collectionName} record` 
      };
    }
    return { title: 'Dashboard', icon: <HomeOutlined />, description: 'Welcome to Dynamic Forms' };
  };

  // User menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        My Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<UserOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  // Menu items
  const getMenuItems = () => {
    const items = [
     
      {
        key: '/forms',
        icon: <FormOutlined />,
        label: <Link to="/forms">Form Builder</Link>,
      }
    ];

    if (collections.length > 0) {
      items.push({
        type: 'divider'
      });

      items.push({
        key: 'collections-header',
        label: (
          <div style={{ 
            padding: '8px 0', 
            color: '#8c8c8c', 
            fontSize: '12px', 
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Collections
          </div>
        ),
        disabled: true
      });

      collections.forEach(col => {
        items.push({
          key: `/table/${col.collectionName}`,
          icon: <DatabaseOutlined />,
          label: (
            <Link to={`/table/${col.collectionName}`}>
              <Space>
                <span style={{ textTransform: 'capitalize' }}>
                  {col.collectionName}
                </span>
                <Badge 
                  count={col.recordCount || 0} 
                  size="small" 
                  style={{ backgroundColor: '#52c41a' }}
                />
              </Space>
            </Link>
          ),
        });
      });
    }

    return items;
  };

  const currentPageInfo = getCurrentPageInfo();

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Enhanced Sidebar */}
      <Sider 
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={280}
        style={{
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        {/* Logo Section */}
        <div style={{ 
          padding: collapsed ? '20px 12px' : '20px 24px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '20px'
        }}>
          {!collapsed ? (
            <div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <AppstoreOutlined style={{ fontSize: '28px', color: 'white' }} />
              </div>
              <Title level={4} style={{ color: 'white', margin: 0, fontSize: '18px' }}>
                Dynamic Forms
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                Form Builder Platform
              </Text>
            </div>
          ) : (
            <AppstoreOutlined style={{ fontSize: '24px', color: 'white' }} />
          )}
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          style={{ 
            background: 'transparent',
            border: 'none',
            color: 'white'
          }}
          theme="dark"
          inlineIndent={collapsed ? 0 : 24}
        />

        {/* Quick Actions (when not collapsed) */}
        {!collapsed && (
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '20px', 
            right: '20px' 
          }}>
            <Card 
              size="small"
              style={{ 
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px'
              }}
              bodyStyle={{ padding: '12px' }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>
                  Quick Actions
                </Text>
                <Button 
                  type="link" 
                  icon={<PlusOutlined />}
                  size="small"
                  style={{ 
                    color: 'white', 
                    padding: '4px 8px',
                    height: 'auto',
                    justifyContent: 'flex-start'
                  }}
                  onClick={() => window.location.href = '/forms'}
                >
                  New Form
                </Button>
              </Space>
            </Card>
          </div>
        )}
      </Sider>
      
      {/* Main Layout */}
      <AntLayout>
        

        {/* Content Area */}
        <Content style={{ 
          margin: 0,
          padding: 0,
          background: 'transparent',
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </AntLayout>

      {/* Custom Styles */}
      <style>{`
        .ant-menu-dark .ant-menu-item {
          background: transparent !important;
          border-radius: 8px !important;
          margin: 4px 12px !important;
          width: calc(100% - 24px) !important;
          color: rgba(255,255,255,0.8) !important;
          transition: all 0.3s ease !important;
        }
        
        .ant-menu-dark .ant-menu-item:hover {
          background: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        
        .ant-menu-dark .ant-menu-item-selected {
          background: rgba(255,255,255,0.15) !important;
          color: white !important;
          font-weight: 500 !important;
        }
        
        .ant-menu-dark .ant-menu-item-selected::after {
          display: none !important;
        }
        
        .ant-menu-dark .ant-menu-submenu-title {
          color: rgba(255,255,255,0.8) !important;
          border-radius: 8px !important;
          margin: 4px 12px !important;
          width: calc(100% - 24px) !important;
        }
        
        .ant-menu-dark .ant-menu-submenu-title:hover {
          background: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        
        .ant-layout-sider-collapsed .ant-menu-dark .ant-menu-item {
          text-align: center !important;
          padding: 0 20px !important;
        }
        
        .ant-menu-dark .ant-menu-item .ant-menu-item-icon {
          font-size: 16px !important;
        }
        
        .ant-menu-dark {
          background: transparent !important;
        }
        
        .ant-layout-sider-trigger {
          background: rgba(0,0,0,0.2) !important;
          color: white !important;
          border-top: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .ant-layout-sider-trigger:hover {
          background: rgba(0,0,0,0.3) !important;
        }
      `}</style>
    </AntLayout>
  );
};

export default Layout;