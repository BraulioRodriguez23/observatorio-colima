// src/utils/axiosClient.js
import axios from 'axios';

// Create an Axios instance with custom configuration
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com', // Base URL for all requests
  headers: {
    'Content-Type': 'application/json', // Default headers
  },
});

// Add request interceptors
axiosClient.interceptors.request.use(
  (config) => {
    // Modify the request config (e.g., add authentication token)
    const token = localStorage.getItem('authToken'); // Example: Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptors
axiosClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response.data; // Return only the data part of the response
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Handle specific HTTP errors
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;