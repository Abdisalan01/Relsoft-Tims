import React, { useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrdersPaged, deleteOrder } from '../../api/orders';
import dayjs from 'dayjs';

const OrdersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', 'paged', pagination.current, pagination.pageSize],
    queryFn: () => getOrdersPaged(pagination.current, pagination.pageSize),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      message.success('Order deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      message.error('Failed to delete order');
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
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 120,
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD HH:mm') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount ? `$${Number(amount).toFixed(2)}` : '$0.00',
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
            onClick={() => navigate(`/orders/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/orders/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete order"
            description="Are you sure you want to delete this order?"
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
    return <div>Error loading orders</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Orders</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/orders/new')}
        >
          New Order
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
          showTotal: (total) => `Total ${total} orders`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default OrdersList;

