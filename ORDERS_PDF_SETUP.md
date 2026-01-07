# Orders PDF Export Setup Guide

## Overview
The PDF export feature for Orders has been implemented with preview functionality, Relsoft branding, and professional formatting.

## Implementation Summary

### Files Modified/Created

1. **PDF Generator Utility** (`src/utils/pdfGenerator.js`)
   - Added `generateOrdersPDF()` function
   - Handles Orders-specific columns and formatting
   - Includes currency formatting for Total Amount
   - Handles empty orders case

2. **OrdersList Component** (`src/pages/OrdersList.jsx`)
   - Added "Export PDF" button in header
   - Integrated PDF preview modal
   - Added loading states

3. **PDF Preview Modal** (`src/components/PDFPreviewModal.jsx`)
   - Reused from Customers implementation
   - Shows PDF preview before download

## Features Implemented

✅ **Preview Before Download** - Modal shows PDF before saving  
✅ **Relsoft Branding** - Logo (left), "Orders Report" (center), Date/Time (right)  
✅ **Dynamic Page Numbering** - "Page X of Y" on every page  
✅ **Professional Footer** - Company name + page numbers  
✅ **Clean Table Layout** - ID, Order Number, Order Date, Status, Total Amount  
✅ **Currency Formatting** - Total Amount displayed as $XX.XX  
✅ **Status Display** - Clear status text (pending, paid, cancelled, etc.)  
✅ **Empty Orders Handling** - Shows "No orders found" message  
✅ **A4 Format** - Standard page size with proper margins  
✅ **Automatic Pagination** - Handles any number of orders  
✅ **Two-Pass Technique** - Correct page numbering on all pages  

## PDF Columns

The PDF includes the following columns:
1. **ID** - Order ID (20mm width)
2. **Order Number** - Order number (50mm width)
3. **Order Date** - Formatted as YYYY-MM-DD HH:mm (50mm width)
4. **Status** - Order status (40mm width)
5. **Total Amount** - Currency formatted, right-aligned (40mm width)

## Logo Setup

### Option 1: Use Existing Logo (Recommended)
If you already set up the logo for Customers PDF:
- Logo should be at `/public/assets/relsoft-logo.png`
- Same logo is used for Orders PDF
- If missing, shows "RELSOFT TIMS" text

### Option 2: Custom Logo Path
Update the logo path in `src/pages/OrdersList.jsx`:

```javascript
const blob = await generateOrdersPDF(ordersToExport, {
  logoPath: '/your/custom/path/logo.png', // Update this
});
```

## How It Works

1. **User clicks "Export PDF" button**
   - Button shows loading state
   - PDF generation starts

2. **PDF is generated**
   - Uses current orders in table (or you can modify to fetch all)
   - Creates PDF with:
     - Header: Logo (left), "Orders Report" (center), Date/Time (right)
     - Table: All order columns with proper formatting
     - Footer: Company name (left), Page numbers (right)

3. **Preview Modal Opens**
   - PDF displayed in iframe
   - User can scroll through pages
   - "Download PDF" button available

4. **User Downloads**
   - Click "Download PDF" to save
   - File name: `orders-report-YYYY-MM-DD.pdf`

## Fetching All Orders (Optional Enhancement)

Currently, the PDF uses orders from the current page. To export ALL orders:

```javascript
const handleExportPDF = async () => {
  try {
    setGeneratingPDF(true);
    message.loading({ content: 'Generating PDF...', key: 'pdf-export', duration: 0 });

    // Fetch ALL orders (you may need to create an API endpoint for this)
    const allOrders = await getAllOrders(); // Implement this API call
    
    const blob = await generateOrdersPDF(allOrders, {
      logoPath: '/assets/relsoft-logo.png',
    });

    setPdfBlob(blob);
    setPdfPreviewVisible(true);
    message.success({ content: 'PDF generated successfully!', key: 'pdf-export' });
  } catch (error) {
    // Error handling
  } finally {
    setGeneratingPDF(false);
  }
};
```

## Customization

### Change Footer Text
Edit `src/utils/pdfGenerator.js`, in `generateOrdersPDF()` function:
```javascript
pdf.text('Your Custom Footer Text', margin.left, pageHeight - 15);
```

### Change Header Title
Edit `src/utils/pdfGenerator.js`:
```javascript
pdf.text('Your Custom Title', pageWidth / 2, 17, { align: 'center' });
```

### Change Table Columns
Edit `src/utils/pdfGenerator.js`, in `generateOrdersPDF()`:
```javascript
// Modify tableData array
const tableData = orders.map((order) => [
  order.id || '',
  order.orderNumber || 'N/A',
  // Add more columns here
]);
```

### Change Colors
Edit `src/utils/pdfGenerator.js`:
- Header color (Relsoft red): `[186, 32, 38]`
- Table header background: `[186, 32, 38]`
- Row striping: `[245, 245, 245]`

### Adjust Column Widths
Edit `src/utils/pdfGenerator.js`, in `columnStyles`:
```javascript
columnStyles: {
  0: { cellWidth: 20 }, // ID
  1: { cellWidth: 50 }, // Order Number
  2: { cellWidth: 50 }, // Order Date
  3: { cellWidth: 40 }, // Status
  4: { cellWidth: 40 }, // Total Amount
}
```

## Date Formatting

Order dates are formatted as: `YYYY-MM-DD HH:mm`
- Example: `2025-12-31 16:04`

To change the format, edit `src/utils/pdfGenerator.js`:
```javascript
order.orderDate
  ? new Date(order.orderDate).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  : 'N/A',
```

## Currency Formatting

Total Amount is formatted as: `$XX.XX`
- Example: `$121.00`, `$99.00`

Format is applied in `src/utils/pdfGenerator.js`:
```javascript
order.totalAmount ? `$${Number(order.totalAmount).toFixed(2)}` : '$0.00',
```

## Testing

1. Navigate to Orders page
2. Click "Export PDF" button
3. Wait for PDF generation (loading indicator)
4. Preview modal should open with PDF
5. Verify:
   - Header shows logo/title/date
   - Table shows all columns correctly
   - Currency amounts are formatted
   - Page numbers show "Page X of Y"
   - Footer shows company name
6. Click "Download PDF" to save

## Empty Orders Test

To test empty orders handling:
1. Filter/search to show 0 orders
2. Click "Export PDF"
3. PDF should show "No orders found" message

## Troubleshooting

### PDF not generating
- Check browser console for errors
- Verify CDN libraries are loading (check Network tab)
- Ensure orders data is available

### Logo not showing
- Check that logo exists at `/public/assets/relsoft-logo.png`
- Check browser console for CORS errors
- Verify logo file format (PNG recommended)

### Page numbers incorrect
- Two-pass technique should handle this automatically
- If issues persist, check `didDrawPage` callback

### Currency not formatting
- Verify `totalAmount` is a number in your data
- Check that the formatting code is correct in pdfGenerator.js

## Notes

- PDF libraries loaded from CDN (unpkg.com)
- First generation may take 2-3 seconds (libraries loading)
- Subsequent generations are faster (libraries cached)
- Supports unlimited orders with automatic pagination
- Uses two-pass technique for accurate page numbering

