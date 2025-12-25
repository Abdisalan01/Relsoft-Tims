import React, { useEffect } from 'react';
import { Form, Input, Button, Card, message, Space, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomerById, updateCustomer } from '../../api/customers';

const CustomerEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (values) => updateCustomer(id, values),
    onSuccess: () => {
      message.success('Customer updated successfully');
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate(`/customers/${id}`);
    },
    onError: (error) => {
      message.error('Failed to update customer');
    },
  });

  useEffect(() => {
    if (customer) {
      form.setFieldsValue(customer);
    }
  }, [customer, form]);

  const onFinish = (values) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Edit Customer</h2>
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
              <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                Update Customer
              </Button>
              <Button onClick={() => navigate(`/customers/${id}`)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CustomerEdit;

