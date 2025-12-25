import { Card, Descriptions, Button, Space, Spin, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomerById, deleteCustomer } from '../../api/customers';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCustomer(id),
    onSuccess: () => {
      message.success('Customer deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
    },
    onError: (error) => {
      message.error('Failed to delete customer');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Customer Details</h2>
        <Space>
          <Button
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate(`/customers/${id}/orders`)}
          >
            View Customer Orders
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/customers/${id}/edit`)}
          >
            Edit
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
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      </div>
      <Card>
        <Descriptions column={1} bordered>
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

