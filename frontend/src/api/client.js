import axios from 'axios';
import { readJson, removeKey, writeJson } from '../utils/storage.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = readJson('token', null);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    setOfflineDemoStatus(false);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeKey('token');
      removeKey('user');
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || error?.message || fallback;
}

const OFFLINE_STATUS_EVENT = 'agriconnect:offline-status';

function setOfflineDemoStatus(isOffline) {
  writeJson('offlineDemo', isOffline);
  window.dispatchEvent(new Event(OFFLINE_STATUS_EVENT));
}

export function isBackendUnavailable(error) {
  if (!error?.response) return true;
  if ([502, 503, 504].includes(error.response.status)) return true;
  return (
    error.response.status === 500 &&
    typeof error.response.data === 'string' &&
    /proxy|econnrefused|ehostunreach/i.test(error.response.data)
  );
}

export async function withDemoFallback(request, fallback) {
  try {
    const response = await request();
    setOfflineDemoStatus(false);
    return response;
  } catch (error) {
    if (!isBackendUnavailable(error)) throw error;
    setOfflineDemoStatus(true);
    return fallback();
  }
}

export function markBackendUnavailable() {
  setOfflineDemoStatus(true);
}

export { OFFLINE_STATUS_EVENT };

export default api;
