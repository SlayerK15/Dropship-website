// src/services/apiInterceptors.js
import axios from 'axios';

export const setupInterceptors = (api, logout) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If the error is 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/token/refresh/`,
            {
              refresh: refreshToken
            }
          );

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log out the user
          logout();
          return Promise.reject(refreshError);
        }
      }

      // Handle other errors
      if (error.response?.status === 403) {
        // Handle forbidden errors
        console.error('Permission denied');
      } else if (error.response?.status === 404) {
        // Handle not found errors
        console.error('Resource not found');
      } else if (error.response?.status >= 500) {
        // Handle server errors
        console.error('Server error');
      }

      return Promise.reject(error);
    }
  );
};