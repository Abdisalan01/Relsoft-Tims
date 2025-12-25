import { Form, Input, InputNumber, Button, Card, message, Space, DatePicker, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createOrder } from '../../api/orders';
import { getCustomersPaged } from '../../api/customers';
import dayjs from 'dayjs';

const { TextArea } = Input;

const OrderCreate = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Fetch customers for dropdown
  const { data: customersData } = useQuery({
    queryKey: ['customers', 'paged', 1, 1000],
    queryFn: () => getCustomersPaged(1, 1000),
  });

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      message.success('Order created successfully');
      navigate('/orders');
    },
    onError: (error) => {
      message.error('Failed to create order');
    },
  });

  const onFinish = (values) => {
    const orderData = {
      ...values,
      orderDate: values.orderDate ? values.orderDate.toISOString() : new Date().toISOString(),
    };
    createMutation.mutate(orderData);
  };

  const customerOptions = customersData?.items?.map(customer => ({
    label: `${customer.name || 'Customer'} (ID: ${customer.id})`,
    value: customer.id,
  })) || [];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Create New Order</h2>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            orderDate: dayjs(),
          }}
        >
          <Form.Item
            label="Customer"
            name="customerId"
            rules={[
              {
                required: true,
                message: 'Please select a customer',
              },
            ]}
          >
            <Select
              placeholder="Select a customer"
              showSearch
              optionFilterProp="label"
              options={customerOptions}
            />
          </Form.Item>

          <Form.Item
            label="Order Number"
            name="orderNumber"
          >
            <Input placeholder="Enter order number" />
          </Form.Item>

          <Form.Item
            label="Order Date"
            name="orderDate"
            rules={[
              {
                required: true,
                message: 'Please select an order date',
              },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
          >
            <Input placeholder="Enter order status" />
          </Form.Item>

          <Form.Item
            label="Total Amount"
            name="totalAmount"
            rules={[
              {
                required: true,
                message: 'Please enter total amount',
              },
            ]}
          >
            <InputNumber
              placeholder="Enter total amount"
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea rows={4} placeholder="Enter order notes" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
                Create Order
              </Button>
              <Button onClick={() => navigate('/orders')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OrderCreate;

