import { createAxiosClient } from '@/api/createAxiosClient';
import { logout } from '@/services/auth';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080/api/v1';
const REFRESH_TOKEN_URL = `${BASE_URL}/token/refresh`;


export const client = createAxiosClient({
  options: {
    withCredentials: true,
    baseURL: BASE_URL,
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    }
  },
  refreshTokenUrl: REFRESH_TOKEN_URL,
  logout: logout,
});
