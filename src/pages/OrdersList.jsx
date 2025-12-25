import { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getOrdersPaged, deleteOrder } from '../api/orders';
import dayjs from 'dayjs';

/**
 * Orders list page with pagination
 */
const OrdersList = () => {
  const navigate = useNavigate();
  
  // State for storing orders data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch orders when page changes
  useEffect(() => {
    fetchOrders();
  }, [pageNumber, pageSize]);

  // Function to fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getOrdersPaged(pageNumber, pageSize);
      setOrders(result.items || []);
      setTotal(result.total || 0);
    } catch (error) {
      message.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete order
  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      message.success('Order deleted successfully');
      // Refresh the list
      fetchOrders();
    } catch (error) {
      message.error('Failed to delete order');
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 120,
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
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/orders/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/orders/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete order"
            description="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
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
        <h2 style={{ margin: 0 }}>Orders</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/orders/new')}
        >
          New Order
        </Button>
      </div>
      
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
    </div>
  );
};

export default OrdersList;

