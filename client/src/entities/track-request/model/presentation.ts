import type { TrackRequestStatus } from './types';

export const requestStatusLabel: Record<TrackRequestStatus, string> = {
  pending: 'Ожидает', accepted: 'Принят', rejected: 'Отклонён',
};

export const requestStatusTone: Record<TrackRequestStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning', accepted: 'success', rejected: 'danger',
};
