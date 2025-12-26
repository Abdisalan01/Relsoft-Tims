import { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import logo from '../assets/Logo.svg';



const { Header, Sider, Content } = Layout;

/**
 * Main layout component with sidebar navigation
 */
const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive collapse on window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Menu items for sidebar
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: 'Customers',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
  ];

  // Handle menu click - navigate to selected page
  const handleMenuClick = ({ key }) => {
    navigate(key);
    // Collapse sidebar on mobile after navigation
    if (window.innerWidth < 992) {
      setCollapsed(true);
    }
  };

  // Figure out which menu item should be highlighted
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/dashboard')) return '/';
    if (path.startsWith('/customers')) return '/customers';
    if (path.startsWith('/orders')) return '/orders';
    return '/';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        collapsible 
        theme="dark"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        trigger={null}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        className="sidebar-responsive"
      >
        <div 
          className="logo-container"
          style={{ 
            height: 64, 
            margin: 16, 
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            overflow: 'hidden',
            padding: collapsed ? '8px' : '12px',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
          onClick={() => navigate('/')}
        >
          {collapsed ? (
            <img 
              src={logo} 
              alt="Relsoft Tims" 
              style={{ 
                height: '40px', 
                width: 'auto'
              }} 
            />
          ) : (
            <img 
              src={logo} 
              alt="Relsoft Tims" 
              style={{ 
                height: '48px', 
                width: 'auto',
                maxWidth: '100%'
              }} 
            />
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      {/* Main content area */}
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 200), 
        transition: 'margin-left 0.2s' 
      }}>
        <Header style={{ 
          background: '#fff', 
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 40, height: 40 }}
            />
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              <img 
                src={logo} 
                alt="Relsoft Tims" 
                style={{ 
                  height: isMobile ? '32px' : '40px', 
                  width: 'auto',
                  maxWidth: isMobile ? '120px' : '200px'
                }} 
              />
            </div>
          </div>
        </Header>
        <Content style={{ 
          margin: isMobile ? '16px 8px' : '24px 16px', 
          padding: isMobile ? 16 : 24, 
          background: '#fff', 
          minHeight: 280,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}>
          <div className="fade-in">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

