# Relsoft Tims
Admin Dashboard

A simple React frontend that consumes the REST API for managing Customers and Orders.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 📋 Requirements Checklist

✅ **Tech Stack:**
- React + Vite
- JavaScript (not TypeScript)
- Axios for API calls
- React Router DOM for navigation
- Ant Design (Table, Form, Input, Button, Modal)

✅ **All API Endpoints Implemented:**

**Customers:**
- ✅ GET `/api/customers`
- ✅ POST `/api/customers`
- ✅ GET `/api/customers/{id}`
- ✅ PUT `/api/customers/{id}`
- ✅ DELETE `/api/customers/{id}`
- ✅ GET `/api/customers/paged?pageNumber=1&pageSize=10`

**Orders:**
- ✅ GET `/api/orders`
- ✅ POST `/api/orders`
- ✅ GET `/api/orders/{id}`
- ✅ PUT `/api/orders/{id}`
- ✅ DELETE `/api/orders/{id}`
- ✅ GET `/api/orders/paged?pageNumber=1&pageSize=10`
- ✅ GET `/api/customers/{customerId}/orders/paged?pageNumber=1&pageSize=10`

✅ **All Pages Implemented:**
1. ✅ Customers List - Table with pagination, View/Edit/Delete buttons, Add New button
2. ✅ Customer Create - Form that POSTs to `/api/customers`, redirects to list on success
3. ✅ Customer Details - Shows customer info, button to view orders
4. ✅ Customer Edit - GET then PUT to `/api/customers/{id}`
5. ✅ Orders List - Table with pagination, View/Edit/Delete buttons, Add New button
6. ✅ Order Create/Edit/Details - Full CRUD for orders
7. ✅ Customer Orders - Table showing orders for a specific customer

✅ **Features:**
- ✅ Loading states (spinners)
- ✅ Error states (error messages)
- ✅ Delete confirmation (Modal/Popconfirm)
- ✅ Success/error messages (Ant Design message)
- ✅ API base URL in one place (`src/api/axios.js`)
- ✅ Clean, beginner-friendly code with comments
- ✅ CORS proxy configured in `vite.config.js`

## 📁 Project Structure

```
src/
  api/
    axios.js          # Axios instance with base URL
    customers.js      # Customer API functions
    orders.js         # Order API functions
  
  pages/
    CustomersList.jsx      # Customers list page
    CustomerForm.jsx       # Create/Edit customer form
    CustomerDetails.jsx    # Customer details page
    CustomerOrders.jsx     # Customer orders list
    OrdersList.jsx         # Orders list page
    OrderForm.jsx          # Create/Edit order form
    OrderDetails.jsx       # Order details page
    Dashboard.jsx          # Dashboard (bonus)
  
  components/
    Layout.jsx        # Main layout with sidebar
    Navbar.jsx       # (Placeholder)
  
  App.jsx            # Main app with routing
  main.jsx           # Entry point
```

## 🔧 Configuration

### API Base URL

The API base URL is configured in `src/api/axios.js`:
```javascript
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://relsofttims-001-site1.gtempurl.com';
```

To change it, create a `.env` file:
```
VITE_API_BASE_URL=http://your-api-url.com
```

### CORS Proxy

If you encounter CORS issues in development, the Vite proxy is already configured in `vite.config.js` to proxy `/api` requests to the target server.

## 📝 API Usage

### Customers

```javascript
import { getCustomersPaged, createCustomer, getCustomerById, updateCustomer, deleteCustomer } from './api/customers';

// Get paged customers
const result = await getCustomersPaged(1, 10);
// Returns: { items: [...], total: 100, pageNumber: 1, pageSize: 10 }

// Create customer
await createCustomer({ name: 'John', email: 'john@example.com', phone: '123456' });

// Get customer by ID
const customer = await getCustomerById(1);

// Update customer
await updateCustomer(1, { name: 'Jane', email: 'jane@example.com' });

// Delete customer
await deleteCustomer(1);
```

### Orders

```javascript
import { getOrdersPaged, createOrder, getOrderById, updateOrder, deleteOrder, getCustomerOrdersPaged } from './api/orders';

// Get paged orders
const result = await getOrdersPaged(1, 10);

// Create order
await createOrder({
  customerId: 1,
  orderNumber: 'ORD-001',
  orderDate: '2024-01-01T00:00:00Z',
  status: 'Pending',
  totalAmount: 99.99,
  notes: 'Some notes'
});

// Get customer orders
const customerOrders = await getCustomerOrdersPaged(1, 1, 10);
```

## 🎨 UI Components Used

- **Table** - For listing customers and orders with pagination
- **Form** - For creating/editing customers and orders
- **Input** - Text inputs for forms
- **Button** - Action buttons
- **Modal/Popconfirm** - Delete confirmation
- **Spin** - Loading indicators
- **message** - Success/error notifications

## 🐛 Troubleshooting

**CORS Errors:**
- The Vite proxy should handle this automatically in development
- Make sure `vite.config.js` has the proxy configuration

**API Not Responding:**
- Check the base URL in `src/api/axios.js`
- Verify the API server is running
- Check browser console for errors

**Page Not Loading:**
- Check the route in `src/App.jsx`
- Verify the component is imported correctly

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized `dist` folder ready for deployment.

## 📚 Code Style

- Simple, beginner-friendly code
- Comments explain what and why
- Uses `useState` and `useEffect` for data fetching (no complex libraries)
- Clean variable names
- Error handling on all API calls
