/**
 * PDF Generator Utility for Relsoft
 * Generates professional PDFs with branding, headers, footers, and page numbering
 */

// Helper function to load PDF libraries from CDN
const loadPDFLibraries = () => {
  return new Promise((resolve, reject) => {
    // Helper to get jsPDF constructor
    const getJsPDF = () => {
      if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
      if (window.jsPDF && window.jsPDF.jsPDF) return window.jsPDF.jsPDF;
      if (window.jspdf && typeof window.jspdf === 'function') return window.jspdf;
      if (window.jsPDF && typeof window.jsPDF === 'function') return window.jsPDF;
      return null;
    };

    // Check if libraries are already loaded
    const jsPDFConstructor = getJsPDF();
    // Check if autoTable is available (it extends jsPDF prototype)
    const testPdf = jsPDFConstructor ? new jsPDFConstructor() : null;
    const hasAutoTable = testPdf && typeof testPdf.autoTable === 'function';
    
    if (jsPDFConstructor && hasAutoTable) {
      resolve({
        jsPDF: jsPDFConstructor,
        autoTable: true, // Just a flag, autoTable is on prototype
        html2canvas: window.html2canvas,
      });
      return;
    }

    // Load jsPDF first
    if (!jsPDFConstructor) {
      const jspdfScript = document.createElement('script');
      jspdfScript.src = 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js';
      jspdfScript.onload = () => {
        // Wait a bit for jsPDF to initialize
        setTimeout(() => {
          const jsPDFConstructor = getJsPDF();
          if (!jsPDFConstructor) {
            reject(new Error('jsPDF failed to initialize'));
            return;
          }

          // Load autoTable
          const autoTableScript = document.createElement('script');
          autoTableScript.src = 'https://unpkg.com/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js';
          autoTableScript.onload = () => {
            // Wait for autoTable to register
            setTimeout(() => {
              const jsPDFConstructor = getJsPDF();
              const testPdf = jsPDFConstructor ? new jsPDFConstructor() : null;
              const hasAutoTable = testPdf && typeof testPdf.autoTable === 'function';
              
              if (jsPDFConstructor && hasAutoTable) {
                // Load html2canvas (for logo if needed)
                if (!window.html2canvas) {
                  const html2canvasScript = document.createElement('script');
                  html2canvasScript.src = 'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js';
                  html2canvasScript.onload = () => {
                    resolve({
                      jsPDF: jsPDFConstructor,
                      autoTable: true,
                      html2canvas: window.html2canvas,
                    });
                  };
                  html2canvasScript.onerror = () => reject(new Error('Failed to load html2canvas'));
                  document.head.appendChild(html2canvasScript);
                } else {
                  resolve({
                    jsPDF: jsPDFConstructor,
                    autoTable: true,
                    html2canvas: window.html2canvas,
                  });
                }
              } else {
                reject(new Error('autoTable failed to load'));
              }
            }, 100);
          };
          autoTableScript.onerror = () => reject(new Error('Failed to load autoTable'));
          document.head.appendChild(autoTableScript);
        }, 100);
      };
      jspdfScript.onerror = () => reject(new Error('Failed to load jsPDF'));
      document.head.appendChild(jspdfScript);
    } else {
      // jsPDF loaded, just need autoTable
      const autoTableScript = document.createElement('script');
      autoTableScript.src = 'https://unpkg.com/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js';
      autoTableScript.onload = () => {
        setTimeout(() => {
          const jsPDFConstructor = getJsPDF();
          const testPdf = jsPDFConstructor ? new jsPDFConstructor() : null;
          const hasAutoTable = testPdf && typeof testPdf.autoTable === 'function';
          
          if (jsPDFConstructor && hasAutoTable) {
            resolve({
              jsPDF: jsPDFConstructor,
              autoTable: true,
              html2canvas: window.html2canvas,
            });
          } else {
            reject(new Error('autoTable failed to load'));
          }
        }, 100);
      };
      autoTableScript.onerror = () => reject(new Error('Failed to load autoTable'));
      document.head.appendChild(autoTableScript);
    }
  });
};

/**
 * Load logo image and convert to base64
 */
const loadLogo = async (logoPath = '/assets/relsoft-logo.png') => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      resolve(null); // Return null if logo fails to load
    };
    img.src = logoPath;
  });
};

/**
 * Generate Customers PDF with Relsoft branding
 * @param {Array} customers - Array of customer objects
 * @param {Object} options - Options for PDF generation
 * @returns {Promise<Blob>} - PDF blob
 */
export const generateCustomersPDF = async (customers, options = {}) => {
  const { searchQuery = '', logoPath = '/assets/relsoft-logo.png' } = options;

  try {
    // Load PDF libraries
    const { jsPDF } = await loadPDFLibraries();

    // Create PDF document (A4, portrait)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = { top: 30, bottom: 30, left: 15, right: 15 };
    const contentWidth = pageWidth - margin.left - margin.right;

    // Load logo
    const logoDataUrl = await loadLogo(logoPath);
    const hasLogo = logoDataUrl !== null;

    // Prepare table data
    const tableData = customers.map((customer) => [
      customer.id || '',
      customer.name || 'N/A',
      customer.email || 'N/A',
    ]);

    // Calculate total pages (autoTable will handle pagination)
    let totalPages = 1;

    // Add header function
    const addHeader = (pdf, pageNum, totalPages) => {
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);

      // Logo on the left
      if (hasLogo && pageNum === 1) {
        try {
          pdf.addImage(logoDataUrl, 'PNG', margin.left, 10, 30, 10);
        } catch (e) {
          // If image fails, use text
          pdf.setFontSize(12);
          pdf.setTextColor(186, 32, 38); // Relsoft red
          pdf.setFont('helvetica', 'bold');
          pdf.text('RELSOFT', margin.left, 17);
        }
      } else if (!hasLogo) {
        pdf.setFontSize(12);
        pdf.setTextColor(186, 32, 38); // Relsoft red
        pdf.setFont('helvetica', 'bold');
        pdf.text('RELSOFT', margin.left, 17);
      }

      // Title centered
      pdf.setFontSize(16);
      pdf.setTextColor(31, 31, 31);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customers Report', pageWidth / 2, 17, { align: 'center' });

      // Date/Time on the right
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      const dateStr = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      pdf.text(dateStr, pageWidth - margin.right, 17, { align: 'right' });

      // Search query if exists
      if (searchQuery && pageNum === 1) {
        pdf.setFontSize(9);
        pdf.setTextColor(140, 140, 140);
        pdf.text(`Search: "${searchQuery}"`, pageWidth / 2, 23, { align: 'center' });
      }
    };

    // Add footer function
    const addFooter = (pdf, pageNum, totalPages) => {
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');

      // Company name on the left
      pdf.text('Relsoft – The 1 Stop Technology Solutions', margin.left, pageHeight - 15);

      // Page number on the right
      pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin.right, pageHeight - 15, {
        align: 'right',
      });
    };

    // Generate table with autoTable
    // Note: autoTable is a plugin that extends jsPDF, so we call it as a method
    pdf.autoTable({
      head: [['ID', 'Name', 'Email']],
      body: tableData,
      startY: hasLogo || searchQuery ? 28 : 25,
      margin: { top: margin.top, left: margin.left, right: margin.right },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [186, 32, 38], // Relsoft red
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 20 }, // ID
        1: { cellWidth: 70 }, // Name
        2: { cellWidth: 90 }, // Email
      },
      didDrawPage: (data) => {
        // Add header and footer to each page
        const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
        totalPages = pdf.internal.getNumberOfPages();
        addHeader(pdf, pageNum, totalPages);
        addFooter(pdf, pageNum, totalPages);
      },
    });

    // Get final page count after table is drawn
    totalPages = pdf.internal.getNumberOfPages();

    // Re-add headers and footers with correct total pages
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addHeader(pdf, i, totalPages);
      addFooter(pdf, i, totalPages);
    }

    // Return PDF as blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Generate Orders PDF with Relsoft branding
 * @param {Array} orders - Array of order objects
 * @param {Object} options - Options for PDF generation
 * @returns {Promise<Blob>} - PDF blob
 */
export const generateOrdersPDF = async (orders, options = {}) => {
  const { logoPath = '/assets/relsoft-logo.png' } = options;

  try {
    // Load PDF libraries
    const { jsPDF } = await loadPDFLibraries();

    // Create PDF document (A4, portrait)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = { top: 30, bottom: 30, left: 15, right: 15 };

    // Load logo
    const logoDataUrl = await loadLogo(logoPath);
    const hasLogo = logoDataUrl !== null;

    // Handle empty orders
    if (!orders || orders.length === 0) {
      // Add header
      if (hasLogo) {
        try {
          pdf.addImage(logoDataUrl, 'PNG', margin.left, 10, 30, 10);
        } catch (e) {
          pdf.setFontSize(12);
          pdf.setTextColor(186, 32, 38);
          pdf.setFont('helvetica', 'bold');
          pdf.text('RELSOFT TIMS', margin.left, 17);
        }
      } else {
        pdf.setFontSize(12);
        pdf.setTextColor(186, 32, 38);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RELSOFT TIMS', margin.left, 17);
      }

      pdf.setFontSize(16);
      pdf.setTextColor(31, 31, 31);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Orders Report', pageWidth / 2, 17, { align: 'center' });

      const dateStr = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text(dateStr, pageWidth - margin.right, 17, { align: 'right' });

      // Add "No orders found" message
      pdf.setFontSize(14);
      pdf.setTextColor(140, 140, 140);
      pdf.text('No orders found', pageWidth / 2, 120, { align: 'center' });

      // Add footer
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Relsoft – The 1 Stop Technology Solutions', margin.left, pageHeight - 15);
      pdf.text('Page 1 of 1', pageWidth - margin.right, pageHeight - 15, { align: 'right' });

      return pdf.output('blob');
    }

    // Prepare table data
    const tableData = orders.map((order) => [
      order.id || '',
      order.orderNumber || 'N/A',
      order.orderDate
        ? new Date(order.orderDate).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'N/A',
      order.status || 'N/A',
      order.totalAmount ? `$${Number(order.totalAmount).toFixed(2)}` : '$0.00',
    ]);

    // Track total pages
    let totalPages = 1;

    // Add header function
    const addHeader = (pdf, pageNum, totalPages) => {
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);

      // Logo on the left
      if (hasLogo && pageNum === 1) {
        try {
          pdf.addImage(logoDataUrl, 'PNG', margin.left, 10, 30, 10);
        } catch (e) {
          pdf.setFontSize(12);
          pdf.setTextColor(186, 32, 38);
          pdf.setFont('helvetica', 'bold');
          pdf.text('RELSOFT TIMS', margin.left, 17);
        }
      } else if (!hasLogo) {
        pdf.setFontSize(12);
        pdf.setTextColor(186, 32, 38);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RELSOFT TIMS', margin.left, 17);
      }

      // Title centered
      pdf.setFontSize(16);
      pdf.setTextColor(31, 31, 31);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Orders Report', pageWidth / 2, 17, { align: 'center' });

      // Date/Time on the right
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      const dateStr = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      pdf.text(dateStr, pageWidth - margin.right, 17, { align: 'right' });
    };

    // Add footer function
    const addFooter = (pdf, pageNum, totalPages) => {
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');

      // Company name on the left
      pdf.text('Relsoft – The 1 Stop Technology Solutions', margin.left, pageHeight - 15);

      // Page number on the right
      pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin.right, pageHeight - 15, {
        align: 'right',
      });
    };

    // Generate table with autoTable
    pdf.autoTable({
      head: [['ID', 'Order Number', 'Order Date', 'Status', 'Total Amount']],
      body: tableData,
      startY: 25,
      margin: { top: margin.top, left: margin.left, right: margin.right },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [186, 32, 38], // Relsoft red
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 20 }, // ID
        1: { cellWidth: 50 }, // Order Number
        2: { cellWidth: 50 }, // Order Date
        3: { cellWidth: 40 }, // Status
        4: { cellWidth: 40, halign: 'right' }, // Total Amount (right-aligned)
      },
      didDrawPage: (data) => {
        // Add header and footer to each page
        const pageNum = pdf.internal.getCurrentPageInfo().pageNumber;
        totalPages = pdf.internal.getNumberOfPages();
        addHeader(pdf, pageNum, totalPages);
        addFooter(pdf, pageNum, totalPages);
      },
    });

    // Get final page count after table is drawn
    totalPages = pdf.internal.getNumberOfPages();

    // Two-pass: Re-add headers and footers with correct total pages
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addHeader(pdf, i, totalPages);
      addFooter(pdf, i, totalPages);
    }

    // Return PDF as blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating Orders PDF:', error);
    throw error;
  }
};

