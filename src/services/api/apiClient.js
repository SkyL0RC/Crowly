import axios from 'axios';

// API Base URL - .env dosyasından gelir
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Axios instance oluştur
 * Tüm API istekleri için merkezi konfigürasyon
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 saniye
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Her istek gönderilmeden önce çalışır
 */
apiClient.interceptors.request.use(
  (config) => {
    // Auth token varsa ekle
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug için
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Her response döndükten sonra çalışır
 */
apiClient.interceptors.response.use(
  (response) => {
    // Backend'den gelen response yapısı: { success: true, data: {...}, message: '...' }
    // Sadece data kısmını döndür
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Hata yönetimi
    const errorMessage = error.response?.data?.error?.message || error.message;
    console.error('API Error:', errorMessage);
    
    // 401 Unauthorized - Token geçersiz
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Login sayfasına yönlendir
      window.location.href = '/wallet-creation';
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
