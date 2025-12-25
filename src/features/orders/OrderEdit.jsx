import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Space, DatePicker, Select, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderById, updateOrder } from '../../api/orders';
import { getCustomersPaged } from '../../api/customers';
import dayjs from 'dayjs';

const { TextArea } = Input;

const OrderEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  // Fetch customers for dropdown
  const { data: customersData } = useQuery({
    queryKey: ['customers', 'paged', 1, 1000],
    queryFn: () => getCustomersPaged(1, 1000),
  });

  const updateMutation = useMutation({
    mutationFn: (values) => updateOrder(id, values),
    onSuccess: () => {
      message.success('Order updated successfully');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(`/orders/${id}`);
    },
    onError: (error) => {
      message.error('Failed to update order');
    },
  });

  useEffect(() => {
    if (order) {
      form.setFieldsValue({
        ...order,
        orderDate: order.orderDate ? dayjs(order.orderDate) : dayjs(),
      });
    }
  }, [order, form]);

  const onFinish = (values) => {
    const orderData = {
      ...values,
      orderDate: values.orderDate ? values.orderDate.toISOString() : new Date().toISOString(),
    };
    updateMutation.mutate(orderData);
  };

  const customerOptions = customersData?.items?.map(customer => ({
    label: `${customer.name || 'Customer'} (ID: ${customer.id})`,
    value: customer.id,
  })) || [];

  if (isLoading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Edit Order</h2>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
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
              <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                Update Order
              </Button>
              <Button onClick={() => navigate(`/orders/${id}`)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OrderEdit;

