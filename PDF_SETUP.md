# PDF Export Setup Guide

## Overview
The PDF export feature has been implemented with preview functionality, Relsoft branding, and professional formatting.

## Files Created/Modified

### 1. PDF Generator Utility
**Location:** `src/utils/pdfGenerator.js`
- Generates PDFs with Relsoft branding
- Handles header, footer, and page numbering
- Supports logo loading with fallback

### 2. PDF Preview Modal
**Location:** `src/components/PDFPreviewModal.jsx`
- Shows PDF preview in a modal before download
- Includes download button
- Uses Ant Design Modal component

### 3. Updated CustomersList
**Location:** `src/pages/CustomersList.jsx`
- Integrated PDF preview functionality
- Replaced direct download with preview modal

## Logo Setup

### Option 1: Add Logo to Public Folder (Recommended)
1. Create a folder `public/assets/` in your project root
2. Place your Relsoft logo file as `relsoft-logo.png` in `public/assets/`
3. The logo will be accessible at `/assets/relsoft-logo.png`

### Option 2: Custom Logo Path
If your logo is in a different location, update the logo path in `src/pages/CustomersList.jsx`:

```javascript
const blob = await generateCustomersPDF(customersToExport, {
  searchQuery: activeSearchQuery,
  logoPath: '/your/custom/path/logo.png', // Update this
});
```

### Logo Requirements
- **Format:** PNG (recommended) or JPG
- **Size:** Recommended 200-300px width, maintain aspect ratio
- **Background:** Transparent PNG works best
- **Fallback:** If logo is not found, "RELSOFT" text will be displayed

## How It Works

1. **User clicks "Export PDF" button**
   - PDF generation starts
   - Loading indicator shows

2. **PDF is generated**
   - Fetches all customers (or current page customers)
   - Creates PDF with:
     - Header: Logo (left), "Customers Report" (center), Date/Time (right)
     - Table: ID, Name, Email columns
     - Footer: "Relsoft – The 1 Stop Technology Solutions" (left), Page numbers (right)

3. **Preview Modal Opens**
   - PDF is displayed in an iframe
   - User can scroll through pages
   - "Download PDF" button available

4. **User Downloads**
   - Click "Download PDF" to save the file
   - File name: `customers-report-YYYY-MM-DD.pdf`

## Features

✅ **Preview before download** - Users can review PDF before saving  
✅ **Professional branding** - Relsoft logo and company name  
✅ **Dynamic page numbering** - "Page X of Y" on every page  
✅ **Clean table layout** - Row striping, proper spacing  
✅ **A4 format** - Standard page size with proper margins  
✅ **Search query support** - Shows search term if PDF is generated from search results  
✅ **Responsive** - Works on mobile and desktop  
✅ **Error handling** - Graceful fallbacks if logo is missing  

## Dependencies

The following packages are used (loaded from CDN):
- `jspdf@2.5.1` - PDF generation
- `jspdf-autotable@3.8.2` - Table generation
- `html2canvas@1.4.1` - Logo image processing

These are loaded dynamically when needed, so they don't affect initial page load.

## Customization

### Change Footer Text
Edit `src/utils/pdfGenerator.js`, line 218:
```javascript
pdf.text('Your Custom Footer Text', margin.left, pageHeight - 15);
```

### Change Header Title
Edit `src/utils/pdfGenerator.js`, line 188:
```javascript
pdf.text('Your Custom Title', pageWidth / 2, 17, { align: 'center' });
```

### Change Table Columns
Edit `src/utils/pdfGenerator.js`, lines 152-156 and 228:
```javascript
// Add more columns to tableData
const tableData = customers.map((customer) => [
  customer.id || '',
  customer.name || 'N/A',
  customer.email || 'N/A',
  customer.phone || 'N/A', // Add more columns
]);
```

### Change Colors
Edit `src/utils/pdfGenerator.js`:
- Header color (Relsoft red): `[186, 32, 38]` - line 173, 239
- Table header background: `[186, 32, 38]` - line 238
- Row striping: `[245, 245, 245]` - line 244

## Testing

1. Navigate to Customers page
2. Click "Export PDF" button
3. Wait for PDF generation (loading indicator)
4. Preview modal should open with PDF
5. Scroll through pages to verify page numbering
6. Click "Download PDF" to save

## Troubleshooting

### Logo not showing
- Check that logo file exists at `/public/assets/relsoft-logo.png`
- Check browser console for CORS errors
- Verify logo file format (PNG recommended)

### PDF not generating
- Check browser console for errors
- Verify CDN libraries are loading (check Network tab)
- Ensure customers data is available

### Page numbers incorrect
- This should be handled automatically by jsPDF
- If issues persist, check `didDrawPage` callback in pdfGenerator.js

## Notes

- PDF libraries are loaded from CDN (unpkg.com) for reliability
- First PDF generation may take a few seconds as libraries load
- Subsequent generations are faster as libraries are cached
- PDF supports unlimited number of customers with automatic pagination

