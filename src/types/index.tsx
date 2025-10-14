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
