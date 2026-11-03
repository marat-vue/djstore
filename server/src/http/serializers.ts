import { apiDate, canonicalUuid } from '../lib/format.js';

export interface TrackRow {
  id: number;
  title: string;
  icon: string;
  artist: string;
  price: number;
  genreId: number;
  genreName: string;
}

export interface TrackRequestRow extends TrackRow {
  requestId: number;
  userFee: number;
  status: 'pending' | 'accepted' | 'rejected';
  isPaid: boolean;
  paymentToken: string;
  paymentId: string;
  createdAt: string;
}

export function serializeTrack(row: TrackRow) {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    genre: { id: row.genreId, name: row.genreName },
    artist: row.artist,
    price: row.price,
  };
}

export function serializeTrackRequest(row: TrackRequestRow, domain: string) {
  return {
    id: row.requestId,
    payment_url: row.paymentId
      ? `${domain}/api/payments/process/${canonicalUuid(row.paymentToken)}/`
      : null,
    track: serializeTrack(row),
    user_fee: row.userFee,
    status: row.status,
    is_paid: row.isPaid,
    payment_token: canonicalUuid(row.paymentToken),
    created_at: apiDate(row.createdAt),
    min_fee: row.price,
    payment_id: row.paymentId,
  };
}

export function serializeVenue(venue: {
  id: number;
  name: string;
  city: string;
  phone: string;
  qrCode: string;
  balance: number;
}, domain: string) {
  return {
    id: venue.id,
    name: venue.name,
    city: venue.city,
    phone: venue.phone,
    qr_code: venue.qrCode ? `${domain}/media/${venue.qrCode}` : '',
    balance: venue.balance,
  };
}
