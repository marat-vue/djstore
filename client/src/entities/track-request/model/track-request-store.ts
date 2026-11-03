import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getApiError } from '@/shared/lib/api-error';
import { trackRequestApi } from '../api/track-request-api';
import type { TrackRequest, TrackRequestStatus } from './types';

export const useTrackRequestStore = defineStore('track-requests', () => {
  const items = ref<TrackRequest[]>([]);
  const isLoading = ref(false);
  const updatingId = ref<number | null>(null);
  const error = ref<string | null>(null);

  async function fetchAll(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      items.value = (await trackRequestApi.getAll()).data;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось загрузить запросы');
    } finally {
      isLoading.value = false;
    }
  }

  async function updateStatus(id: number, status: TrackRequestStatus): Promise<boolean> {
    updatingId.value = id;
    error.value = null;
    try {
      const updated = (await trackRequestApi.updateStatus(id, status)).data;
      items.value = items.value.map((item) => item.id === id ? updated : item);
      return true;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось изменить статус запроса');
      return false;
    } finally {
      updatingId.value = null;
    }
  }

  return { items, isLoading, updatingId, error, fetchAll, updateStatus };
});
