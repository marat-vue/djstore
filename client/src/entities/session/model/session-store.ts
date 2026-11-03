import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared/api/http';
import { getApiError } from '@/shared/lib/api-error';
import { sessionApi } from '../api/session-api';
import type { RegistrationData, VenueProfile } from './types';

export const useSessionStore = defineStore('session', () => {
  const profile = ref<VenueProfile | null>(null);
  const isInitializing = ref(false);
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);

  const hasToken = computed(() => Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)));
  const isAuthenticated = computed(() => hasToken.value && Boolean(profile.value));

  function clearError() {
    error.value = null;
  }

  function clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    profile.value = null;
  }

  async function fetchProfile(): Promise<boolean> {
    if (!hasToken.value) return false;
    try {
      const { data } = await sessionApi.getProfile();
      profile.value = data;
      return true;
    } catch (requestError) {
      clearSession();
      error.value = getApiError(requestError, 'Не удалось загрузить профиль');
      return false;
    }
  }

  async function initialize(): Promise<void> {
    if (!hasToken.value || profile.value || isInitializing.value) return;
    isInitializing.value = true;
    await fetchProfile();
    isInitializing.value = false;
  }

  async function login(username: string, password: string): Promise<boolean> {
    isSubmitting.value = true;
    clearError();
    try {
      const { data } = await sessionApi.login(username, password);
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
      return await fetchProfile();
    } catch (requestError) {
      clearSession();
      error.value = getApiError(requestError, 'Не удалось войти в аккаунт');
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  async function register(data: RegistrationData): Promise<boolean> {
    isSubmitting.value = true;
    clearError();
    try {
      await sessionApi.register(data);
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось создать аккаунт');
      isSubmitting.value = false;
      return false;
    }
    isSubmitting.value = false;
    return login(data.username, data.password);
  }

  async function updateProfile(data: Partial<Pick<VenueProfile, 'name' | 'city' | 'phone'>>): Promise<boolean> {
    isSubmitting.value = true;
    clearError();
    try {
      const response = await sessionApi.updateProfile(data);
      profile.value = response.data;
      return true;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось сохранить профиль');
      return false;
    } finally {
      isSubmitting.value = false;
    }
  }

  function logout() {
    clearSession();
    clearError();
  }

  return {
    profile,
    error,
    hasToken,
    isAuthenticated,
    isInitializing,
    isSubmitting,
    initialize,
    fetchProfile,
    login,
    register,
    updateProfile,
    logout,
    clearError,
  };
});
