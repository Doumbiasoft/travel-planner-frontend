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
