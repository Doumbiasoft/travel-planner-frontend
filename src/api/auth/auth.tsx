import type {
  CredentialsData,
  GoogleOauthData,
  RegisterData,
} from "../../types";
import Api from "../api-base-config";

class Auth {
  static async login(data: CredentialsData): Promise<any> {
    return await Api.post(`api/v1/auth/login`, { data });
  }
  static async register(data: RegisterData): Promise<any> {
    return await Api.post(`api/v1/auth/register`, { data });
  }
  static async logout(): Promise<any> {
    return await Api.post(`api/v1/auth/logout`);
  }
  static async getMe(): Promise<any> {
    return await Api.get(`api/v1/auth/me`);
  }
  static async refreshToken(): Promise<any> {
    return await Api.post(`api/v1/auth/refresh-token`);
  }
  static async activate(data: {
    accountActivationToken: string;
  }): Promise<any> {
    return await Api.patch(`api/v1/auth/activate`, { data });
  }
  static async forgotPassword(data: { email: string }): Promise<any> {
    return await Api.post(`api/v1/auth/forgot-password`, { data });
  }
  static async changePassword(data: {
    passwordResetToken: string;
    password: string;
  }): Promise<any> {
    return await Api.post(`api/v1/auth/change-password`, { data });
  }
  static async verifyCurrentPassword(data: { password: string }): Promise<any> {
    return await Api.post(`api/v1/auth/verify-current-password`, { data });
  }
  static async updateProfile(data: {
    firstName: string;
    lastName: string;
  }): Promise<any> {
    return await Api.patch(`api/v1/auth/update-profile`, { data });
  }
  static async deleteAccount(data: { email: string }): Promise<any> {
    return await Api.delete(`api/v1/auth/delete-account`, { data });
  }
  static async signInWithGoogle(data: GoogleOauthData): Promise<any> {
    return await Api.post(`api/v1/auth/oauth-google`, { data });
  }
}

export default Auth;
