// Authentication
export interface CredentialsData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GoogleOauthData {
  firstName: string;
  lastName: string;
  email: string;
  oauthUid: string;
  oauthProvider: string;
  oauthPicture: string;
}

// Current user interface
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  oauthProvider: string;
  oauthUid: string;
  oauthPicture: string;
  isOauth: boolean;
  passwordResetToken: string;
  activationToken: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrip {
  _id?: string;
  tripName: string;
  origin: string;
  originCityCode: string;
  destination: string;
  destinationCityCode: string;
  startDate: string;
  endDate: string;
  budget: number;
  markers: { lat: number; lng: number; label: string }[];
  createdAt?: string;
}

export interface FilterState {
  tripName: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget: string;
  maxBudget: string;
}

export interface CityCode {
  name: string;
  iataCode: string;
}
