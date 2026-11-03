export interface Genre {
  id: number;
  name: string;
}

export interface Track {
  id: number;
  title: string;
  icon: string;
  genre: Genre;
  artist: string;
  price: number;
}

export interface TrackPayload {
  title: string;
  artist: string;
  icon: string;
  genre_id: number;
  price: number;
}

export interface TrackFilters {
  genre?: number;
  search?: string;
}
