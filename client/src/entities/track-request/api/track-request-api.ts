import { http } from '@/shared/api/http';
import type { TrackRequest, TrackRequestStatus } from '../model/types';

export const trackRequestApi = {
  create: (venueId: number, track: number, userFee: number) =>
    http.post<TrackRequest>(`venue/${venueId}/request/`, { track, user_fee: userFee }),
  getPayment: (token: string) => http.get<TrackRequest>(`requests/pay/${token}/`),
  pay: (token: string, amount: number) => http.post(`requests/pay/${token}/`, { amount }),
  getAll: () => http.get<TrackRequest[]>('requests/'),
  updateStatus: (id: number, status: TrackRequestStatus) =>
    http.patch<TrackRequest>(`requests/${id}/`, { status }),
};
