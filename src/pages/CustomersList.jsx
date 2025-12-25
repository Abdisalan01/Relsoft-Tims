import { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCustomersPaged, deleteCustomer } from '../api/customers';

/**
 * Customers list page with pagination
 */
const CustomersList = () => {
  const navigate = useNavigate();
  
  // State for storing customers data
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch customers when page changes
  useEffect(() => {
    fetchCustomers();
  }, [pageNumber, pageSize]);

  // Function to fetch customers from API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const result = await getCustomersPaged(pageNumber, pageSize);
      setCustomers(result.items || []);
      setTotal(result.total || 0);
    } catch (error) {
      message.error('Failed to load customers');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete customer
  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      message.success('Customer deleted successfully');
      // Refresh the list
      fetchCustomers();
    } catch (error) {
      message.error('Failed to delete customer');
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
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
            onClick={() => navigate(`/customers/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/customers/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete customer"
            description="Are you sure you want to delete this customer?"
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
        <h2 style={{ margin: 0 }}>Customers</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/customers/new')}
        >
          New Customer
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={customers}
        loading={loading}
        rowKey="id"
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} customers`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default CustomersList;

