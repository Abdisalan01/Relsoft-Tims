import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import AppLayout from './components/Layout';

// Import all pages
import Dashboard from './pages/Dashboard';
import CustomersList from './pages/CustomersList';
import CustomerForm from './pages/CustomerForm';
import CustomerDetails from './pages/CustomerDetails';
import CustomerOrders from './pages/CustomerOrders';
import OrdersList from './pages/OrdersList';
import OrderForm from './pages/OrderForm';
import OrderDetails from './pages/OrderDetails';

/**
 * Main App component - handles routing
 */
function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ba2026',
          borderRadius: 6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Customers routes */}
            <Route path="/customers" element={<CustomersList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/customers/:id/edit" element={<CustomerForm />} />
            <Route path="/customers/:customerId/orders" element={<CustomerOrders />} />
            
            {/* Orders routes */}
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/orders/:id/edit" element={<OrderForm />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
