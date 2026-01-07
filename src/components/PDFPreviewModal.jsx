import { useState, useEffect } from 'react';
import { Modal, Button, Spin, message } from 'antd';
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons';

/**
 * PDF Preview Modal Component
 * Shows a preview of the generated PDF before download
 */
const PDFPreviewModal = ({ visible, onCancel, pdfBlob, title = 'PDF Preview' }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && pdfBlob) {
      setLoading(true);
      // Create object URL for PDF blob
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setLoading(false);

      // Cleanup on unmount
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } else {
      // Cleanup when modal closes
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    }
  }, [visible, pdfBlob]);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      message.success('PDF downloaded successfully!');
    }
  };

  const handleCancel = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FilePdfOutlined />
          <span>{title}</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Close
        </Button>,
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          disabled={!pdfBlob}
        >
          Download PDF
        </Button>,
      ]}
      style={{ top: 20 }}
      bodyStyle={{ padding: 0, height: 'calc(100vh - 200px)', overflow: 'hidden' }}
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Loading PDF preview..." />
        </div>
      ) : pdfUrl ? (
        <iframe
          src={pdfUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="PDF Preview"
        />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>No PDF to preview</p>
        </div>
      )}
    </Modal>
  );
};

export default PDFPreviewModal;

