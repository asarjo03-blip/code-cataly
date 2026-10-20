import axios from 'axios';
import { readJson, removeKey, writeJson } from '../utils/storage.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 5000,
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
    if (/text\/html/i.test(response.headers?.['content-type'] || '')) {
      const error = new Error('The API server returned a web page instead of an API response');
      error.code = 'ERR_BACKEND_UNAVAILABLE';
      return Promise.reject(error);
    }
    if (response.config?.url !== '/health') setOfflineDemoStatus(false);
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
  const wasOffline = readJson('offlineDemo', false);
  writeJson('offlineDemo', isOffline);
  if (wasOffline !== isOffline) {
    window.dispatchEvent(new CustomEvent(OFFLINE_STATUS_EVENT, { detail: { isOffline } }));
  }
}

export function isBackendUnavailable(error) {
  if (!error?.response) return true;
  if (/text\/html/i.test(error.response.headers?.['content-type'] || '')) return true;
  if ([502, 503, 504].includes(error.response.status)) return true;
  if (error.response.status !== 500) return false;
  const contentType = error.response.headers?.['content-type'] || '';
  if (contentType && !/application\/json/i.test(contentType)) return true;
  const responseText =
    typeof error.response.data === 'string'
      ? error.response.data
      : `${error.response.data?.message || ''} ${error.response.data?.error || ''}`;
  return /proxy error|econnrefused|ehostunreach|enotfound|socket hang up/i.test(responseText);
}

export async function withDemoFallback(request, fallback) {
  if (hasDemoSession()) {
    return fallback();
  }
  if (readJson('offlineDemo', false)) {
    return fallback();
  }
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

export async function retryBackend() {
  try {
    const response = await api.get('/health');
    const available =
      response.data?.status === 'ok' && response.data?.database === 'connected';
    setOfflineDemoStatus(!available);
    return available;
  } catch (error) {
    if (!isBackendUnavailable(error)) throw error;
    setOfflineDemoStatus(true);
    return false;
  }
}

export function hasDemoSession() {
  return String(readJson('token', '') || '').startsWith('demo-');
}

export { OFFLINE_STATUS_EVENT };

export default api;
