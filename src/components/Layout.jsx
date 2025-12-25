import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

/**
 * Main layout component with sidebar navigation
 */
const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
      <Sider collapsible theme="dark">
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      
      {/* Main content area */}
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 500 }}>
           Relsoft Tims
          </h1>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

