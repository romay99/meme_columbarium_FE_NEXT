'use client';
import axios from 'axios';

const serverUrl =
  process.env.NEXT_PUBLIC_BACK_END_API_URL || 'http://localhost:8080';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: serverUrl,
  withCredentials: true, // 리프레시 토큰이 쿠키에 있는 경우 필요
});

// 요청 인터셉터: 매 요청마다 액세스 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 액세스 토큰 만료 시 리프레시 토큰으로 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 무한루프 방지

      try {
        // ✅ 리프레시 토큰으로 새 액세스 토큰 발급
        const res = await axios.post(
          `${serverUrl}/member/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = res.data.accessToken;

        // ✅ 로컬스토리지 갱신
        localStorage.setItem('token', 'Bearer ' + newToken);

        // ✅ Authorization 헤더 갱신 후 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.error('리프레시 토큰 실패:', refreshErr);
        localStorage.removeItem('token');
        window.location.href = '/member/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
