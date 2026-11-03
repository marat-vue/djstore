export interface VenueProfile {
  id: number;
  name: string;
  city: string;
  phone: string;
  qr_code: string;
  balance: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface RegistrationData {
  username: string;
  password: string;
  email: string;
  name: string;
  city: string;
  phone: string;
}
