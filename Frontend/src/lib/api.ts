import axios from 'axios';
import { getStoredDevice, generateHmacHeaders } from './hmac';
import { isTokenExpired, performAutoLogout } from './tokenUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});



// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Check if token is expired before making request
    if (isTokenExpired(token)) {
      performAutoLogout();
      return Promise.reject(new Error('Token expired'));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Attach HMAC headers for protected endpoints
  const hmacEndpoints = ['/points/balance', '/waste/submit', '/coupons/redeem'];
  const url = config.url || '';
  if (hmacEndpoints.some(e => url.includes(e))) {
    const device = getStoredDevice();
    if (device) {
      const hmacHeaders = generateHmacHeaders(device, config.data);
      Object.assign(config.headers, hmacHeaders);
    }
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses (token expired/invalid)
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || '';
      
      // Check for token expiration messages
      if (errorMessage.toLowerCase().includes('token') && 
          (errorMessage.toLowerCase().includes('expired') || 
           errorMessage.toLowerCase().includes('invalid') ||
           errorMessage.toLowerCase().includes('unauthorized'))) {
        performAutoLogout();
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
      
      // For other 401 errors, also logout to be safe
      performAutoLogout();
      return Promise.reject(new Error('Authentication failed. Please login again.'));
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  login: (identifier: string, password: string, deviceId: string = 'web-client') =>
    api.post('/auth/login', { identifier, password, deviceId: deviceId.length >= 4 ? deviceId : 'web-client' }),
  register: (data: { name: string; email: string; password: string, deviceId?: string }) =>
    api.post('/auth/register', { ...data, deviceId: (data.deviceId && data.deviceId.length >= 4 ? data.deviceId : 'web-client') }),
  // Add refresh and rotate-device-secret if needed
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  rotateDeviceSecret: (deviceId: string) => api.post('/auth/rotate-device-secret', { deviceId }),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateRole: (role: string) => api.patch('/user/role', { role }),
  getAllUsers: () => api.get('/user/all'),
  updateUserRole: (userId: string, role: string) => api.patch(`/user/${userId}/role`, { role }),
};

export const adsAPI = {
  getAds: () => api.get('/ads'),
  getAllAds: () => api.get('/ads/all'), // Admin only
  createAd: (data: any) => api.post('/ads', data),
  getMyAds: () => api.get('/ads/my'),
  updateAd: (id: string, data: any) => api.patch(`/ads/${id}`, data),
  deleteAd: (id: string) => api.delete(`/ads/${id}`),
};

export const wasteAPI = {
  submitWaste: (data: any) => api.post('/waste/submit', data),
  reviewWaste: (id: string, data: any) => api.post(`/waste/${id}/review`, data),
  getMyPickups: () => api.get('/waste/my'),
  getAllPickups: () => api.get('/waste/all'), // For BUSINESS/ADMIN
};

export const pointsAPI = {
  getBalance: () => api.get('/points/balance'),
};

export const couponsAPI = {
  getCoupons: () => api.get('/coupons'),
  getAllCoupons: () => api.get('/coupons/all'), // Admin only
  createCoupon: (data: any) => api.post('/coupons', data),
  getMyCoupons: () => api.get('/coupons/my'),
  updateCoupon: (id: string, data: any) => api.patch(`/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/coupons/${id}`),
  redeemCoupon: (data: any) => api.post('/coupons/redeem', data),
  verifyAndUse: (data: any) => api.post('/coupons/verify', data),
  getVerificationHistory: () => api.get('/coupons/verification-history'),
};

// Remove or update other APIs as needed to match backend

export default api;
