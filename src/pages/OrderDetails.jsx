import { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Space, Spin, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderById, deleteOrder } from '../api/orders';
import dayjs from 'dayjs';

/**
 * Order details page - shows order information
 */
const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Load order data when component mounts
  useEffect(() => {
    loadOrder();
  }, [id]);

  // Fetch order from API
  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      message.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete order
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteOrder(id);
      message.success('Order deleted successfully');
      navigate('/orders');
    } catch (error) {
      message.error('Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  // Show loading spinner while fetching
  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />;
  }

  // Show error if order not found
  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Order Details</h2>
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/orders/${id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete order"
            description="Are you sure you want to delete this order?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={deleting}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      </div>
      
      <Card>
        <Descriptions column={1} bordered>
          {order.id && (
            <Descriptions.Item label="ID">{order.id}</Descriptions.Item>
          )}
          <Descriptions.Item label="Customer ID">{order.customerId || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Order Number">{order.orderNumber || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {order.orderDate ? dayjs(order.orderDate).format('YYYY-MM-DD HH:mm') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">{order.status || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            {order.totalAmount ? `$${Number(order.totalAmount).toFixed(2)}` : '$0.00'}
          </Descriptions.Item>
          <Descriptions.Item label="Notes">{order.notes || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderDetails;

