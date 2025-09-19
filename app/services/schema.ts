// Services/schema.ts

// ===== SIGNUP =====
export interface SignupRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  otpExpiresInMinutes: number;
}

// ===== LOGIN =====
export interface LoginRequest {
  identifier: string; // username or email
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
}

// ===== FORGOT PASSWORD =====
export interface ForgotPasswordRequest {
  identifier: string; // username or email
}

export interface ForgotPasswordResponse {
  message: string;
  otpExpiresInMinutes: number;
  username: string;
  email: string;
}

// ===== VERIFY OTP =====
export interface VerifyOtpRequest {
  identifier: string; // username or email
  code: string;
  purpose: "signup" | "password_reset";
}

export interface VerifyOtpResponse {
  message: string;
  user?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
  accessToken?: string;
}

// ===== RESET PASSWORD =====
export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// ===== LOGOUT =====
export interface LogoutResponse {
  message: string;
}
