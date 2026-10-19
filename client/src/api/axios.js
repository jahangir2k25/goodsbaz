import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('elegance_user'));
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch (e) {
    /* ignore */
  }
  return config;
});

export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';

export default api;
