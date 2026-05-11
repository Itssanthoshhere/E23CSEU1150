import axios from 'axios';

// API endpoints for evaluation service
const BASE_URL = '/api/evaluation-service/notifications';
const AUTH_URL = '/auth';

// User credentials from .env
const CREDENTIALS = {
  email: import.meta.env.VITE_EMAIL,
  name: import.meta.env.VITE_NAME,
  rollNo: import.meta.env.VITE_ROLLNO,
  accessCode: import.meta.env.VITE_ACCESS_CODE,
  clientID: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET
};

const service = axios.create({
  baseURL: BASE_URL,
});

let sessionToken = null;

// Helper to refresh auth token when it expires
const refreshToken = async () => {
  try {
    console.log('Refreshing authentication token...');
    const res = await axios.post(AUTH_URL, CREDENTIALS);
    sessionToken = res.data.access_token;
    return sessionToken;
  } catch (err) {
    console.error('Auth refresh failed:', err.response?.data || err.message);
    throw new Error('Authentication failed. Please check your credentials.');
  }
};

// Inject token into every request
service.interceptors.request.use(async (config) => {
  if (!sessionToken) {
    await refreshToken();
  }
  config.headers.Authorization = `Bearer ${sessionToken}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auto-retry once if we get a 401 (token probably expired)
service.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    if (error.response?.status === 401 && !originalReq._isRetry) {
      originalReq._isRetry = true;
      const freshToken = await refreshToken();
      originalReq.headers.Authorization = `Bearer ${freshToken}`;
      return axios(originalReq);
    }
    return Promise.reject(error);
  }
);

/**
 * Main fetcher for notifications
 * Supports page, limit, and notification_type filters
 */
export const getNotifications = async (filters = {}) => {
  try {
    const res = await service.get('', { params: filters });
    return res.data;
  } catch (err) {
    // Log meaningful error for UI consumption
    const msg = err.response?.data?.message || 'Server connection error';
    console.error(`[API Error]: ${msg}`);
    throw err;
  }
};
