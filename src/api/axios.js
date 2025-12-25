import axios from 'axios';
import { message } from 'antd';

// In development, use relative paths so Vite proxy handles CORS
// In production, use the full API URL
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? '' // Use relative paths in dev (Vite proxy will handle it)
  : (import.meta.env.VITE_API_BASE_URL || 'https://relsofttims-001-site1.gtempurl.com');

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Show error messages to user when API calls fail
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Show error message if something goes wrong
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    message.error(errorMessage);
    return Promise.reject(error);
  }
);

export default apiClient;
