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
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      responsive: ['md'],
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 120,
      responsive: ['lg'],
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      ellipsis: true,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => date ? dayjs(date).format(isMobile ? 'MM/DD' : 'YYYY-MM-DD HH:mm') : 'N/A',
      responsive: ['md'],
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
      responsive: ['md'],
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'actions-column',
      width: isMobile ? 200 : 220,
      fixed: isMobile ? undefined : 'right',
      // No responsive property - always visible on all screen sizes
      render: (_, record) => {
        // ✅ Mobile: stacked full-width buttons (always visible, easy tap)
        if (isMobile) {
          return (
            <div className="mobile-actions">
              <Button
                block
                icon={<EyeOutlined />}
                onClick={() => navigate(`/orders/${record.id}`)}
              >
                View
              </Button>

              <Button
                block
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
                <Button block danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          );
        }

        // ✅ Desktop: compact inline actions
        return (
          <Space size="small" className="table-actions">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/orders/${record.id}`)}
              size="small"
            >
              View
            </Button>

            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/orders/${record.id}/edit`)}
              size="small"
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
              <Button type="link" danger icon={<DeleteOutlined />} size="small">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Orders</h2>
        <div className="page-header-actions">
          <Button
            type="primary"
            icon={isMobile ? null : <PlusOutlined />}
            onClick={() => navigate('/orders/new')}
            block={isMobile}
            className={isMobile ? 'add-Order-mobile-btn' : undefined}
          >
            {isMobile ? 'Add New Order' : 'New Order'}
          </Button>
        </div>
      </div>
      
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
          // ✅ Optional: remove horizontal scroll on mobile to avoid hiding actions
          scroll={isMobile ? undefined : { x: 'max-content' }}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
            responsive: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default OrdersList;

