import axios from 'axios';

// Base URL của API
// const BASE_URL = 'https://isiah-hyperhilarious-disheartenedly.ngrok-free.dev/api';
const BASE_URL = 'https://nonconsolable-nonurban-ellis.ngrok-free.dev/api';

// Tạo axios instance với cấu hình cơ bản
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
});

// Request interceptor để tự động thêm token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor để xử lý lỗi chung
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi 401 - Token hết hạn
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
export { BASE_URL };