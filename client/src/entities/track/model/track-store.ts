import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getApiError } from '@/shared/lib/api-error';
import { trackApi } from '../api/track-api';
import type { Genre, Track, TrackFilters, TrackPayload } from './types';

export const useTrackStore = defineStore('tracks', () => {
  const items = ref<Track[]>([]);
  const genres = ref<Genre[]>([]);
  const current = ref<Track | null>(null);
  const isLoading = ref(false);
  const isLoadingGenres = ref(false);
  const isSaving = ref(false);
  const deletingId = ref<number | null>(null);
  const error = ref<string | null>(null);

  function clearError() { error.value = null; }

  async function fetchAll(venueId: number, filters?: TrackFilters): Promise<void> {
    isLoading.value = true;
    clearError();
    try {
      items.value = (await trackApi.getAll(venueId, filters)).data;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось загрузить треки');
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchOne(venueId: number, trackId: number): Promise<Track | null> {
    isLoading.value = true;
    clearError();
    try {
      current.value = (await trackApi.getOne(venueId, trackId)).data;
      return current.value;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Трек не найден');
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchGenres(): Promise<void> {
    isLoadingGenres.value = true;
    try {
      genres.value = (await trackApi.getGenres()).data;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось загрузить жанры');
    } finally {
      isLoadingGenres.value = false;
    }
  }

  async function create(venueId: number, payload: TrackPayload): Promise<Track | null> {
    isSaving.value = true;
    clearError();
    try {
      const track = (await trackApi.create(venueId, payload)).data;
      items.value.unshift(track);
      return track;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось добавить трек');
      return null;
    } finally {
      isSaving.value = false;
    }
  }

  async function update(venueId: number, trackId: number, payload: TrackPayload): Promise<Track | null> {
    isSaving.value = true;
    clearError();
    try {
      const track = (await trackApi.update(venueId, trackId, payload)).data;
      current.value = track;
      items.value = items.value.map((item) => item.id === track.id ? track : item);
      return track;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось сохранить трек');
      return null;
    } finally {
      isSaving.value = false;
    }
  }

  async function remove(venueId: number, trackId: number): Promise<boolean> {
    deletingId.value = trackId;
    clearError();
    try {
      await trackApi.remove(venueId, trackId);
      items.value = items.value.filter((item) => item.id !== trackId);
      return true;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось удалить трек');
      return false;
    } finally {
      deletingId.value = null;
    }
  }

  async function createGenre(name: string): Promise<Genre | null> {
    try {
      const genre = (await trackApi.createGenre(name)).data;
      genres.value.push(genre);
      return genre;
    } catch (requestError) {
      error.value = getApiError(requestError, 'Не удалось добавить жанр');
      return null;
    }
  }

  return {
    items, genres, current, error, isLoading, isLoadingGenres, isSaving, deletingId,
    fetchAll, fetchOne, fetchGenres, create, update, remove, createGenre, clearError,
  };
});
