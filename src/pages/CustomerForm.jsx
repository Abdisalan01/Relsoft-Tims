import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomerById, createCustomer, updateCustomer } from '../api/customers';

/**
 * Customer form component - used for both creating and editing
 */
const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if editing
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const isEditMode = !!id; // Check if we're editing or creating

  // Load customer data if editing
  useEffect(() => {
    if (isEditMode) {
      loadCustomer();
    }
  }, [id]);

  // Load customer data from API
  const loadCustomer = async () => {
    setLoading(true);
    try {
      const customer = await getCustomerById(id);
      form.setFieldsValue(customer);
    } catch (error) {
      message.error('Failed to load customer');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isEditMode) {
        // Update existing customer
        await updateCustomer(id, values);
        message.success('Customer updated successfully');
        navigate(`/customers/${id}`);
      } else {
        // Create new customer
        await createCustomer(values);
        message.success('Customer created successfully');
        navigate('/customers');
      }
    } catch (error) {
      message.error(isEditMode ? 'Failed to update customer' : 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>
        {isEditMode ? 'Edit Customer' : 'Create New Customer'}
      </h2>
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
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? 'Update Customer' : 'Create Customer'}
              </Button>
              <Button onClick={() => navigate(isEditMode ? `/customers/${id}` : '/customers')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CustomerForm;

