import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Space, DatePicker, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrderById, createOrder, updateOrder } from '../api/orders';
import { getCustomersPaged } from '../api/customers';
import dayjs from 'dayjs';

const { TextArea } = Input;

/**
 * Order form component - used for both creating and editing
 */
const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if editing
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const isEditMode = !!id; // Check if we're editing or creating

  // Load order data and customers when component mounts
  useEffect(() => {
    loadCustomers();
    if (isEditMode) {
      loadOrder();
    } else {
      // Set default date for new orders
      form.setFieldsValue({
        orderDate: dayjs(),
      });
    }
  }, [id]);

  // Load customers for dropdown
  const loadCustomers = async () => {
    try {
      const result = await getCustomersPaged(1, 1000); // Get many customers for dropdown
      setCustomers(result.items || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  // Load order data from API if editing
  const loadOrder = async () => {
    setLoading(true);
    try {
      const order = await getOrderById(id);
      form.setFieldsValue({
        ...order,
        orderDate: order.orderDate ? dayjs(order.orderDate) : dayjs(),
      });
    } catch (error) {
      message.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Convert date to ISO string format for API
      const orderData = {
        ...values,
        orderDate: values.orderDate ? values.orderDate.toISOString() : new Date().toISOString(),
      };
      
      if (isEditMode) {
        // Update existing order
        await updateOrder(id, orderData);
        message.success('Order updated successfully');
        navigate(`/orders/${id}`);
      } else {
        // Create new order
        await createOrder(orderData);
        message.success('Order created successfully');
        navigate('/orders');
      }
    } catch (error) {
      message.error(isEditMode ? 'Failed to update order' : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  // Prepare customer options for dropdown
  const customerOptions = customers.map(customer => ({
    label: `${customer.name || 'Customer'} (ID: ${customer.id})`,
    value: customer.id,
  }));

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>
        {isEditMode ? 'Edit Order' : 'Create New Order'}
      </h2>
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
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? 'Update Order' : 'Create Order'}
              </Button>
              <Button onClick={() => navigate(isEditMode ? `/orders/${id}` : '/orders')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default OrderForm;

