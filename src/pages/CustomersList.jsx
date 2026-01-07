import { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Input, Dropdown, Modal } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCustomersPaged, deleteCustomer, searchCustomers } from '../api/customers';
import { generateCustomersPDF } from '../utils/pdfGenerator';
import PDFPreviewModal from '../components/PDFPreviewModal';

const CustomersList = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Responsive behavior (mobile <= 768px)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load data (paged or search)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeSearchQuery.trim()) {
          const result = await searchCustomers(activeSearchQuery, pageNumber, pageSize);
          setCustomers(result.items || []);
          setTotal(result.total || 0);
        } else {
          const result = await getCustomersPaged(pageNumber, pageSize);
          setCustomers(result.items || []);
          setTotal(result.total || 0);
        }
      } catch (error) {
        message.error(activeSearchQuery.trim() ? 'Failed to search customers' : 'Failed to load customers');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageNumber, pageSize, activeSearchQuery]);

  const onSearch = () => {
    setPageNumber(1);
    setActiveSearchQuery(searchQuery.trim());
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setActiveSearchQuery('');
      setPageNumber(1);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      message.success('Customer deleted successfully');

      // Reload data respecting current search state
      if (activeSearchQuery.trim()) {
        const result = await searchCustomers(activeSearchQuery, pageNumber, pageSize);
        setCustomers(result.items || []);
        setTotal(result.total || 0);
      } else {
        const result = await getCustomersPaged(pageNumber, pageSize);
        setCustomers(result.items || []);
        setTotal(result.total || 0);
      }
    } catch (error) {
      message.error('Failed to delete customer');
    }
  };

  // Generate and preview PDF
  const handleExportPDF = async () => {
    try {
      setGeneratingPDF(true);
      message.loading({ content: 'Generating PDF...', key: 'pdf-export', duration: 0 });

      // Get all customers for PDF (you might want to fetch all or use current page)
      // For now, using current customers in state
      const customersToExport = customers;

      if (!customersToExport || customersToExport.length === 0) {
        message.warning({ content: 'No customers to export', key: 'pdf-export' });
        setGeneratingPDF(false);
        return;
      }

      // Generate PDF using the utility
      const blob = await generateCustomersPDF(customersToExport, {
        searchQuery: activeSearchQuery,
        logoPath: '/assets/relsoft-logo.png', // Update this path to your logo location
      });

      setPdfBlob(blob);
      setPdfPreviewVisible(true);
      message.success({ content: 'PDF generated successfully!', key: 'pdf-export' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error({
        content: error.message || 'Failed to generate PDF. Please try again.',
        key: 'pdf-export',
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      responsive: ['md'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      responsive: ['lg'],
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'actions-column',
      width: isMobile ? 120 : 100,
      fixed: isMobile ? undefined : 'right',
      // No responsive property - always visible on all screen sizes
      render: (_, record) => {
        const menuItems = [
          {
            key: 'view',
            label: 'View',
            icon: <EyeOutlined />,
            onClick: () => navigate(`/customers/${record.id}`),
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            onClick: () => navigate(`/customers/${record.id}/edit`),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: 'Delete customer',
                content: 'Are you sure you want to delete this customer?',
                okText: 'Yes',
                cancelText: 'No',
                okType: 'danger',
                onOk: () => handleDelete(record.id),
              });
            },
          },
        ];

        // ✅ Mobile: stacked full-width buttons (always visible, easy tap)
        if (isMobile) {
          return (
            <div className="mobile-actions">
              <Button
                block
                icon={<EyeOutlined />}
                onClick={() => navigate(`/customers/${record.id}`)}
              >
                View
              </Button>

              <Button
                block
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
                <Button block danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          );
        }

        // ✅ Desktop: dropdown menu
        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              className="action-dropdown-btn"
            />
          </Dropdown>
        );
      },
    },
  ];

  const handleTableChange = (pagination) => {
    setPageNumber(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Customers</h2>

        <div className="page-header-actions">
          <div className="search-container">
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={onSearchChange}
              onPressEnter={onSearch}
              allowClear
              prefix={<SearchOutlined />}
            />

            <Button
              type="primary"
              icon={!isMobile ? <SearchOutlined /> : null}
              onClick={onSearch}
              block={isMobile}
            >
              Search
            </Button>
          </div>

          {/* ✅ Desktop: icon + text. ✅ Mobile: full-width text only, NO plus icon */}
          <Button
            type="primary"
            icon={isMobile ? null : <PlusOutlined />}
            onClick={() => navigate('/customers/new')}
            block={isMobile}
            className={isMobile ? 'add-customer-mobile-btn' : undefined}
          >
            {isMobile ? 'Add New Customer' : 'New Customer'}
          </Button>

          {/* PDF Export Button */}
          <Button
            type="default"
            icon={<FilePdfOutlined />}
            onClick={handleExportPDF}
            block={isMobile}
            loading={generatingPDF}
            disabled={generatingPDF || customers.length === 0}
          >
            {isMobile ? 'Export PDF' : 'Export PDF'}
          </Button>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        visible={pdfPreviewVisible}
        onCancel={() => {
          setPdfPreviewVisible(false);
          setPdfBlob(null);
        }}
        pdfBlob={pdfBlob}
        title="Customers Report Preview"
      />

      <div className="table-responsive">
        <Table
          columns={columns}
          dataSource={customers}
          loading={loading}
          rowKey="id"
          // ✅ Optional: remove horizontal scroll on mobile to avoid hiding actions
          scroll={isMobile ? undefined : { x: 'max-content' }}
          pagination={{
            current: pageNumber,
            pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `Total ${t} customers`,
            responsive: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default CustomersList;
