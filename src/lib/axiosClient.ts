import axios from 'axios';
import { getCustomerAuthToken, isTokenExpired } from './auth';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'https://graven-metal-backend.onrender.com/api';

export const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
  const token = getCustomerAuthToken();
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
