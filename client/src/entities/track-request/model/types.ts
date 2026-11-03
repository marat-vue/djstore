import type { Track } from '@/entities/track/model/types';

export type TrackRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface TrackRequest {
  id: number;
  payment_url: string | null;
  track: Track;
  user_fee: number;
  min_fee: number;
  status: TrackRequestStatus;
  is_paid: boolean;
  payment_token: string;
  payment_id: string;
  created_at: string;
}
