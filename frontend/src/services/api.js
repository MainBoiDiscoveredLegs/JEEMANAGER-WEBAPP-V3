import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
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

export const register = async (userData) => {
  try {
    const response = await api.post('/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login/', credentials);
    const { access, refresh, user } = response.data;
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getChapters = async () => {
  try {
    const response = await api.get('/chapters/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProgress = async () => {
  try {
    const response = await api.get('/progress/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProgress = async (id, data) => {
  try {
    const response = await api.patch(`/progress/${id}/`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};