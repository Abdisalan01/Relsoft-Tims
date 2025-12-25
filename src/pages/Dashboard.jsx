import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getCustomersPaged } from '../api/customers';
import { getOrdersPaged } from '../api/orders';

/**
 * Dashboard page - shows overview statistics
 */
const Dashboard = () => {
  const [customersTotal, setCustomersTotal] = useState(0);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load statistics when component mounts
  useEffect(() => {
    loadStats();
  }, []);

  // Fetch statistics from API
  const loadStats = async () => {
    setLoading(true);
    try {
      // Get first page of customers and orders to get total count
      const customersResult = await getCustomersPaged(1, 1);
      const ordersResult = await getOrdersPaged(1, 1);
      
      setCustomersTotal(customersResult.total || 0);
      setOrdersTotal(ordersResult.total || 0);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Customers"
              value={customersTotal}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Total Orders"
              value={ordersTotal}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
