export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  profilePic?: string;
}

export interface UserSignupRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: UserResponse;
  error?: string;
}
