import React, { useState } from 'react';
import { Table, Button, Space, Spin } from 'antd';
import { EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCustomerOrdersPaged } from '../../api/orders';
import dayjs from 'dayjs';

const CustomerOrders = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-orders', customerId, pagination.current, pagination.pageSize],
    queryFn: () => getCustomerOrdersPaged(customerId, pagination.current, pagination.pageSize),
    enabled: !!customerId,
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
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
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/orders/${record.id}`)}
        >
          View
        </Button>
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
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/customers/${customerId}`)}
            style={{ marginRight: 16 }}
          >
            Back to Customer
          </Button>
          <h2 style={{ margin: 0, display: 'inline' }}>Customer Orders</h2>
        </div>
      </div>
      {isLoading ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />
      ) : (
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
      )}
    </div>
  );
};

export default CustomerOrders;

