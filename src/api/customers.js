import apiClient from './axios';

/**
 * Get all customers (simple list)
 */
export const getCustomers = async () => {
  const response = await apiClient.get('/customers');
  // API might return array directly or wrapped in object
  return Array.isArray(response.data) ? response.data : response.data?.items || response.data?.data || [];
};

/**
 * Get customers with pagination
 * pageNumber: which page to show (starts at 1)
 * pageSize: how many items per page
 */
export const getCustomersPaged = async (pageNumber = 1, pageSize = 10) => {
  const response = await apiClient.get('/customers/paged', {
    params: { pageNumber, pageSize },
  });
  
  const data = response.data;
  
  // Handle different response shapes from API
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      pageNumber: 1,
      pageSize: data.length,
    };
  }
  
  // Try common response formats
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
  
  // Fallback if we don't recognize the format
  return {
    items: [],
    total: 0,
    pageNumber: pageNumber,
    pageSize: pageSize,
  };
};

/**
 * Get one customer by ID
 */
export const getCustomerById = async (id) => {
  const response = await apiClient.get(`/customers/${id}`);
  return response.data;
};

/**
 * Create a new customer
 */
export const createCustomer = async (customerData) => {
  const response = await apiClient.post('/customers', customerData);
  return response.data;
};

/**
 * Update existing customer
 */
export const updateCustomer = async (id, customerData) => {
  const response = await apiClient.put(`/customers/${id}`, customerData);
  return response.data;
};

/**
 * Delete a customer
 */
export const deleteCustomer = async (id) => {
  const response = await apiClient.delete(`/customers/${id}`);
  return response.data;
};

/**
 * Search customers with pagination
 * query: search term
 * pageNumber: which page to show (starts at 1)
 * pageSize: how many items per page
 */
export const searchCustomers = async (query, pageNumber = 1, pageSize = 10) => {
  // Note: Backend has unusual endpoint path: /api/customers/api/customers/search
  const response = await apiClient.get('/customers/api/customers/search', {
    params: { query, pageNumber, pageSize },
  });
  
  const data = response.data;
  
  // Handle different response shapes from API
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      pageNumber: 1,
      pageSize: data.length,
    };
  }
  
  // Try common response formats
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
  
  // Fallback if we don't recognize the format
  return {
    items: [],
    total: 0,
    pageNumber: pageNumber,
    pageSize: pageSize,
  };
};