import { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Input } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCustomersPaged, deleteCustomer, searchCustomers } from '../api/customers';

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
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
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
  
  // Fetch customers when page changes
  useEffect(() => {
    const loadData = async () => {
      if (activeSearchQuery.trim()) {
        setLoading(true);
        try {
          const result = await searchCustomers(activeSearchQuery, pageNumber, pageSize);
          setCustomers(result.items || []);
          setTotal(result.total || 0);
        } catch (error) {
          message.error('Failed to search customers');
          console.error('Error searching customers:', error);
        } finally {
          setLoading(false);
        }
      } else {
        fetchCustomers();
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, activeSearchQuery]);

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


  // Handle search button click
  const onSearch = () => {
    setPageNumber(1); // Reset to first page when searching
    setActiveSearchQuery(searchQuery.trim());
  };

  // Handle search input change
  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // If search is cleared, reset active search and fetch all customers
    if (!e.target.value.trim()) {
      setActiveSearchQuery('');
      setPageNumber(1);
    }
  };

  // Handle delete customer
  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      message.success('Customer deleted successfully');
      // Refresh the list - maintain current search state
      if (activeSearchQuery.trim()) {
        const result = await searchCustomers(activeSearchQuery, pageNumber, pageSize);
        setCustomers(result.items || []);
        setTotal(result.total || 0);
      } else {
        fetchCustomers();
      }
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
      responsive: ['md'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      responsive: ['lg'],
    },
    {
      title: 'Actions',
      key: 'actions',
      width: isMobile ? 120 : 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" className="table-actions">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/customers/${record.id}`)}
            size="small"
          >
            {!isMobile && 'View'}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/customers/${record.id}/edit`)}
            size="small"
          >
            {!isMobile && 'Edit'}
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
              size="small"
            >
              {!isMobile && 'Delete'}
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
      <div className="page-header">
        <h2>Customers</h2>
        <div className="page-header-actions">
          <div className="search-container">
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={onSearchChange}
              onPressEnter={onSearch}
              style={{ flex: 1 }}
              allowClear
              prefix={<SearchOutlined />}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={onSearch}
            >
              {!isMobile && 'Search'}
            </Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/customers/new')}
            block={isMobile}
          >
            {isMobile ? <PlusOutlined /> : 'New Customer'}
          </Button>
        </div>
      </div>
      
      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={customers}
          loading={loading}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} customers`,
            responsive: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default CustomersList;

