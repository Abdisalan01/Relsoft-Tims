import axios from 'axios';
import { message } from 'antd';

// In development, Vite proxy handles /api requests
// In production, Vercel serverless function handles /api requests
// Both use the same baseURL pattern
const baseURL = '/api';

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
