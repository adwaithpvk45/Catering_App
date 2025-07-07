import axios from 'axios';
import appConfig from './appConfig';
import { toast } from 'react-toastify'; // must install: npm i react-toastify

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: appConfig.baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: attach token
axiosInstance.interceptors.request.use((config) => {
  const token = appConfig.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

// Let browser handle boundary for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }  
  return config;
});

// Response Interceptor: auto-logout on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      toast.error('Session expired. Logging out...');
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
