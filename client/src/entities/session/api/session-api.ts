import { http } from '@/shared/api/http';
import type { AuthTokens, RegistrationData, VenueProfile } from '../model/types';

export const sessionApi = {
  login: (username: string, password: string) => http.post<AuthTokens>('token/', { username, password }),
  register: (data: RegistrationData) => http.post('register/', data),
  getProfile: () => http.get<VenueProfile>('profile/'),
  updateProfile: (data: Partial<Pick<VenueProfile, 'name' | 'city' | 'phone'>>) =>
    http.patch<VenueProfile>('profile/', data),
};
