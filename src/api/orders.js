import apiClient from './axios';

/**
 * Get all orders (simple list)
 */
export const getOrders = async () => {
  const response = await apiClient.get('/orders');
  return Array.isArray(response.data) ? response.data : response.data?.items || response.data?.data || [];
};

/**
 * Get orders with pagination
 */
export const getOrdersPaged = async (pageNumber = 1, pageSize = 10) => {
  const response = await apiClient.get('/orders/paged', {
    params: { pageNumber, pageSize },
  });
  
  const data = response.data;
  
  // Handle different response shapes
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      pageNumber: 1,
      pageSize: data.length,
    };
  }
  
  if (data.items) {
    return {
      items: data.items,
      total: data.totalCount || data.total || data.items.length,
      pageNumber: data.pageNumber || pageNumber,
      pageSize: data.pageSize || pageSize,
    };
  }
  
  if (data.data) {
    return {
      items: data.data,
      total: data.total || data.data.length,
      pageNumber: data.pageNumber || pageNumber,
      pageSize: data.pageSize || pageSize,
    };
  }
  
  return {
    items: [],
    total: 0,
    pageNumber: pageNumber,
    pageSize: pageSize,
  };
};

/**
 * Get orders for a specific customer (with pagination)
 */
export const getCustomerOrdersPaged = async (customerId, pageNumber = 1, pageSize = 10) => {
  const response = await apiClient.get(`/customers/${customerId}/orders/paged`, {
    params: { pageNumber, pageSize },
  });
  
  const data = response.data;
  
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      pageNumber: 1,
      pageSize: data.length,
    };
  }
  
  if (data.items) {
    return {
      items: data.items,
      total: data.totalCount || data.total || data.items.length,
      pageNumber: data.pageNumber || pageNumber,
      pageSize: data.pageSize || pageSize,
    };
  }
  
  if (data.data) {
    return {
      items: data.data,
      total: data.total || data.data.length,
      pageNumber: data.pageNumber || pageNumber,
      pageSize: data.pageSize || pageSize,
    };
  }
  
  return {
    items: [],
    total: 0,
    pageNumber: pageNumber,
    pageSize: pageSize,
  };
};

/**
 * Get one order by ID
 */
export const getOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

/**
 * Update existing order
 */
export const updateOrder = async (id, orderData) => {
  const response = await apiClient.put(`/orders/${id}`, orderData);
  return response.data;
};

/**
 * Delete an order
 */
export const deleteOrder = async (id) => {
  const response = await apiClient.delete(`/orders/${id}`);
  return response.data;
};
