import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (username: string, password: string) =>
    api.post('/auth/register', { username, password }),
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { nickname?: string; avatar?: string; bio?: string }) =>
    api.put('/auth/profile', data),
};

export const eventApi = {
  getEvents: (type?: string) =>
    api.get('/events', { params: { type } }),
  getEvent: (id: number) => api.get(`/events/${id}`),
  createEvent: (data: {
    title: string;
    date: string;
    type: string;
    description?: string;
    isRecurring?: boolean;
    remindDays?: number;
  }) => api.post('/events', data),
  updateEvent: (id: number, data: {
    title?: string;
    date?: string;
    type?: string;
    description?: string;
    isRecurring?: boolean;
    remindDays?: number;
  }) => api.put(`/events/${id}`, data),
  deleteEvent: (id: number) => api.delete(`/events/${id}`),
};

export const shareApi = {
  createShareLink: (eventId: number, expiresInDays?: number) =>
    api.post('/share', { eventId, expiresInDays }),
  getSharedEvent: (token: string) => api.get(`/share/${token}`),
};

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId: number, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: number) => api.delete(`/admin/users/${userId}`),
  getEvents: () => api.get('/admin/events'),
  deleteEvent: (eventId: number) => api.delete(`/admin/events/${eventId}`),
};

export default api;
