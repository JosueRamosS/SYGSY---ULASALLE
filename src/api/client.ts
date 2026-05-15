import axios from 'axios';
import { mockAdapter } from './mockData';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

// Cliente HTTP axios. Si VITE_USE_MOCK=true se usa un adapter local
// que intercepta las llamadas y responde con datos fake (modo demo).
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    ...(useMock ? { adapter: mockAdapter } : {}),
});

if (useMock) {
    // eslint-disable-next-line no-console
    console.info('[SYGSY] Modo MOCK activo — el backend está simulado en el navegador.');
}

// Request Interceptor: Add Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401/403
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login if necessary
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
