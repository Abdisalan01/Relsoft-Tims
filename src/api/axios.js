import axios from 'axios';
import { message } from 'antd';

// In development, Vite proxy handles /api requests
// In production, Vercel serverless function handles /api requests
// Both use the same baseURL pattern
// Ensure baseURL always starts with / and doesn't end with /
const baseURL = '/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log and ensure correct URL construction
apiClient.interceptors.request.use(
  (config) => {
    // Ensure the URL is constructed correctly
    if (config.url && !config.url.startsWith('http')) {
      // Ensure baseURL is set
      if (!config.baseURL) {
        config.baseURL = baseURL;
      }
      // Ensure url starts with / for proper joining with baseURL
      if (!config.url.startsWith('/')) {
        config.url = '/' + config.url;
      }
      // Log for debugging
      const fullURL = `${config.baseURL}${config.url}`;
      console.log('API Request:', {
        baseURL: config.baseURL,
        url: config.url,
        fullURL: fullURL,
        method: config.method?.toUpperCase(),
        params: config.params
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
