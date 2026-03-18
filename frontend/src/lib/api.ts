// VendoX Frontend — lib/api.ts

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ── Axios instance ────────────────────────────────────────────────
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach access token ──────────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('vendox_access_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: auto-refresh on 401 ────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('vendox_refresh_token')
        : null;

      if (!refreshToken) {
        processQueue(error, null);
        isRefreshing = false;
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        localStorage.setItem('vendox_access_token', accessToken);
        localStorage.setItem('vendox_refresh_token', newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);

function redirectToLogin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vendox_access_token');
    localStorage.removeItem('vendox_refresh_token');
    localStorage.removeItem('vendox_user');
    window.location.href = '/login';
  }
}

// ── Typed API helpers ─────────────────────────────────────────────
export const authApi = {
  login:          (data: { email: string; password: string })          => api.post('/auth/login', data),
  register:       (data: { email: string; password: string; fullName: string }) => api.post('/auth/register', data),
  logout:         (refreshToken?: string)                              => api.post('/auth/logout', { refreshToken }),
  me:             ()                                                    => api.get('/auth/me'),
  forgotPassword: (email: string)                                      => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token: string, newPassword: string)                 => api.post('/auth/reset-password', { token, newPassword }),
};

export const feedApi = {
  getFeed:     (params?: { page?: number; limit?: number; sortBy?: string }) => api.get('/posts/feed', { params }),
  getTrending: (params?: { period?: string; categoryId?: string })           => api.get('/posts/trending', { params }),
  getPost:     (id: string)                                                   => api.get(`/posts/${id}`),
  createPost:  (data: FormData)                                               => api.post('/posts', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePost:  (id: string)                                                   => api.delete(`/posts/${id}`),
};

export const storesApi = {
  getStores:    (params?: any)    => api.get('/stores', { params }),
  getStore:     (slug: string)    => api.get(`/stores/${slug}`),
  getMyStore:   ()                => api.get('/stores/my/store'),
  createStore:  (data: any)       => api.post('/stores', data),
  updateStore:  (id: string, data: any) => api.patch(`/stores/${id}`, data),
  getMapStores: (params?: any)    => api.get('/map/stores', { params }),
};

export const khasniApi = {
  getRequests:   (params?: any)              => api.get('/khasni/requests', { params }),
  getRequest:    (id: string)                => api.get(`/khasni/requests/${id}`),
  createRequest: (data: any)                 => api.post('/khasni/requests', data),
  respond:       (id: string, data: any)     => api.post(`/khasni/requests/${id}/respond`, data),
  close:         (id: string, fulfilled: boolean) => api.patch(`/khasni/requests/${id}/close`, { fulfilled }),
};

export const socialApi = {
  toggleLike:  (targetType: string, targetId: string) => api.post('/likes', { targetType, targetId }),
  savePost:    (postId: string)                        => api.post(`/saves/${postId}`),
  unsavePost:  (postId: string)                        => api.delete(`/saves/${postId}`),
  followStore: (storeId: string)                       => api.post(`/follows/${storeId}`),
  unfollow:    (storeId: string)                       => api.delete(`/follows/${storeId}`),
  comment:     (postId: string, content: string)       => api.post(`/posts/${postId}/comments`, { content }),
  getComments: (postId: string, page?: number)         => api.get(`/posts/${postId}/comments`, { params: { page } }),
};

export const notificationsApi = {
  getAll:      (page?: number)  => api.get('/notifications', { params: { page } }),
  unreadCount: ()               => api.get('/notifications/unread-count'),
  markRead:    (id: string)     => api.patch(`/notifications/${id}/read`),
  markAllRead: ()               => api.patch('/notifications/read-all'),
};

export const uploadApi = {
  image:  (file: File, folder?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (folder) form.append('folder', folder);
    return api.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  images: (files: File[], folder?: string) => {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    if (folder) form.append('folder', folder ?? 'posts');
    return api.post('/upload/images', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const searchApi = {
  search: (q: string, type?: string) => api.get('/search', { params: { q, type } }),
};
