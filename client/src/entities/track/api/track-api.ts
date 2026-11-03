import { http } from '@/shared/api/http';
import type { Genre, Track, TrackFilters, TrackPayload } from '../model/types';

export const trackApi = {
  getAll: (venueId: number, params?: TrackFilters) => http.get<Track[]>(`venue/${venueId}/tracks/`, { params }),
  getOne: (venueId: number, trackId: number) => http.get<Track>(`venue/${venueId}/tracks/${trackId}/`),
  create: (venueId: number, data: TrackPayload) => http.post<Track>(`venue/${venueId}/tracks/`, data),
  update: (venueId: number, trackId: number, data: TrackPayload) =>
    http.patch<Track>(`venue/${venueId}/tracks/${trackId}/`, data),
  remove: (venueId: number, trackId: number) => http.delete(`venue/${venueId}/tracks/${trackId}/`),
  getGenres: () => http.get<Genre[]>('genres/'),
  createGenre: (name: string) => http.post<Genre>('genres/', { name }),
};
