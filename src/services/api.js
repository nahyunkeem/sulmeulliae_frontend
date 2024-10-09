import axios from 'axios';

const api = axios.create({
    baseURL: 'http://api.sulmeulliae.com/api/v1',  // 백엔드 API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청을 보내기 전, 토큰이 있으면 헤더에 포함
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;
