import { useState, useEffect } from 'react';
import { Table, Button, Spin } from 'antd';
import { EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerOrdersPaged } from '../api/orders';
import dayjs from 'dayjs';

/**
 * Shows all orders for a specific customer
 */
const CustomerOrders = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch orders when page changes
  useEffect(() => {
    if (customerId) {
      fetchOrders();
    }
  }, [customerId, pageNumber, pageSize]);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getCustomerOrdersPaged(customerId, pageNumber, pageSize);
      setOrders(result.items || []);
      setTotal(result.total || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount ? `$${Number(amount).toFixed(2)}` : '$0.00',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orders/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/customers/${customerId}`)}
            style={{ marginRight: 16 }}
          >
            Back to Customer
          </Button>
          <h2 style={{ margin: 0, display: 'inline' }}>Customer Orders</h2>
        </div>
      </div>
      
      {loading ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
          onChange={handleTableChange}
        />
      )}
    </div>
  );
};

export default CustomerOrders;

