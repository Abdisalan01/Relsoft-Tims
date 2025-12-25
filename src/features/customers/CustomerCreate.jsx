import { Form, Input, Button, Card, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createCustomer } from '../../api/customers';

const CustomerCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      message.success('Customer created successfully');
      navigate('/customers');
    },
    onError: (error) => {
      message.error('Failed to create customer');
    },
  });

  const onFinish = (values) => {
    createMutation.mutate(values);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Create New Customer</h2>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
          >
            <Input placeholder="Enter customer name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Please enter a valid email',
              },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
                Create Customer
              </Button>
              <Button onClick={() => navigate('/customers')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CustomerCreate;

