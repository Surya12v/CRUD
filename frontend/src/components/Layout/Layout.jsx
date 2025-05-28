import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

const { Header, Content, Sider } = AntLayout;

const Layout = ({ children }) => {
  // 1. State Management
  const [collections, setCollections] = useState([]);
  const location = useLocation(); // For tracking active menu item

  // 2. Data Fetching
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    // Fetches all form configurations from backend
    try {
      const response = await axios.get(config.endpoints.formBuilder);
      setCollections(response.data);
    } catch (error) {
      console.error('Failed to fetch collections');
    }
  };

  // 3. Menu Structure
  const items = [
    // Static Form Builder item
    {
      key: 'forms',
      label: <Link to="/forms">Form Builder</Link>,
    },
    // Dynamic Collections submenu
    {
      key: 'collections',
      label: 'Collections',
      children: collections.map(col => ({
        key: col.collectionName,
        label: (
          <Link to={`/table/${col.collectionName}`}>
            {col.collectionName}
          </Link>
        ),
      }))
    }
  ];

  // 4. Layout Structure
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Left Sidebar */}
      <Sider width={200} theme="light">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      
      {/* Main Content Area */}
      <AntLayout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children} {/* Renders route content */}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
