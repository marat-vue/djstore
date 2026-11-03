import axios from 'axios';

export function getApiError(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as Record<string, unknown> | undefined;
  if (!data) return error.code === 'ECONNABORTED' ? 'Сервер отвечает слишком долго' : fallback;
  if (typeof data.detail === 'string') return data.detail;

  const firstFieldError = Object.values(data).find((value) => Array.isArray(value) && value.length);
  if (Array.isArray(firstFieldError) && typeof firstFieldError[0] === 'string') return firstFieldError[0];
  return fallback;
}
