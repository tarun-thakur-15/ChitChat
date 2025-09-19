// Services/api.ts
import axios from "axios";
import {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LogoutResponse,
} from "./schema";

// Create axios instance (optional, you can add baseURL & headers)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000/api",
  withCredentials: true, // to allow cookies (like accessToken)
});

// ===== SIGNUP =====
export const signupApi = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>("/signup", data);
  return response.data;
};

// ===== LOGIN =====
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/login", data);
  return response.data;
};

// ===== FORGOT PASSWORD =====
export const forgotPasswordApi = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>("/forgot-password", data);
  return response.data;
};

// ===== VERIFY OTP =====
export const verifyOtpApi = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  const response = await api.post<VerifyOtpResponse>("/verify-otp", data);
  return response.data;
};

// ===== RESET PASSWORD =====
export const resetPasswordApi = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>("/reset-password", data);
  return response.data;
};

// ===== LOGOUT =====
export const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>("/logout");
  return response.data;
};
