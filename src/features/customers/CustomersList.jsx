import React, { useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomersPaged, deleteCustomer } from '../../api/customers';

const CustomersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', 'paged', pagination.current, pagination.pageSize],
    queryFn: () => getCustomersPaged(pagination.current, pagination.pageSize),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      message.success('Customer deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      message.error('Failed to delete customer');
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

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

  const handleTableChange = (newPagination) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  if (error) {
    return <div>Error loading customers</div>;
  }

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
        dataSource={data?.items || []}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} customers`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default CustomersList;

