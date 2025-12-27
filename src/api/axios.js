import axios from 'axios';
import { message } from 'antd';


const baseURL = '/api';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Ensure url starts with / for proper joining with baseURL
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/')) {
      config.url = '/' + config.url;
    }
    
    // Log the full URL for debugging
    const fullURL = config.url?.startsWith('http') 
      ? config.url 
      : `${config.baseURL}${config.url}`;
    
    console.log('API Request:', {
      baseURL: config.baseURL,
      url: config.url,
      fullURL: fullURL,
      method: config.method?.toUpperCase(),
      params: config.params
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
