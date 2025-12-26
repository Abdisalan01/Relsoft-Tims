import { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Space, Spin, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerById, deleteCustomer } from '../api/customers';

/**
 * Customer details page - shows customer information
 */
const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Load customer daata
  useEffect(() => {
    loadCustomer();
  }, [id]);

  // Fetch customer from API
  const loadCustomer = async () => {
    setLoading(true);
    try {
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (error) {
      message.error('Failed to load customer');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete customer
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCustomer(id);
      message.success('Customer deleted successfully');
      navigate('/customers');
    } catch (error) {
      message.error('Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  // Show loading spinner while fetching
  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />;
  }

  // Show error if customer not found
  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Customer Details</h2>
        <div className="page-header-actions">
          <Space wrap>
            <Button
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate(`/customers/${id}/orders`)}
            >
              <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>View Orders</span>
              {window.innerWidth < 768 && <ShoppingCartOutlined />}
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/customers/${id}/edit`)}
            >
              <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>Edit</span>
              {window.innerWidth < 768 && <EditOutlined />}
            </Button>
            <Popconfirm
              title="Delete customer"
              description="Are you sure you want to delete this customer?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={deleting}
              >
                <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>Delete</span>
                {window.innerWidth < 768 && <DeleteOutlined />}
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </div>
      
      <Card>
        <Descriptions 
          column={{ xs: 1, sm: 1, md: 2, lg: 2 }} 
          bordered
          size="middle"
        >
          {customer.id && (
            <Descriptions.Item label="ID">{customer.id}</Descriptions.Item>
          )}
          <Descriptions.Item label="Name">{customer.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email">{customer.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{customer.phone || 'N/A'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default CustomerDetails;

