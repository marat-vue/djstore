const defaultApiUrl = 'http://127.0.0.1:8000/api/';

export const appConfig = {
  apiUrl: (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/?$/, '/'),
};
