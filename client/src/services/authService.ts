import { SignupRequest, LoginRequest, AuthResponse } from "../types/auth";
import { API_BASE_URL } from "../config";

// Use the environment variable for the backend URL with fallback for development
const API_URL = `${API_BASE_URL}/api/auth`;

// Common fetch options for API requests
const fetchOptions = (method: string, data?: any): RequestInit => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include', // Important for cookies/sessions
  ...(data && { body: JSON.stringify(data) }),
});

export const authService = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/signup`, fetchOptions('POST', data));

      const result = await response.json();

      // Store token and refresh token if signup successful
      if (result.success && result.token) {
        try {
          // Store all items atomically
          await Promise.all([
            Promise.resolve(localStorage.setItem("token", result.token)),
            result.refreshToken
              ? Promise.resolve(
                localStorage.setItem("refreshToken", result.refreshToken)
              )
              : Promise.resolve(),
            Promise.resolve(
              localStorage.setItem("user", JSON.stringify(result.user))
            ),
          ]);
        } catch (err) {
          console.error("Failed to store auth data:", err);
          return { success: false, error: "Failed to complete authentication" };
        }
      }

      return result;
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "Failed to connect to server" };
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, fetchOptions('POST', data));

      const result = await response.json();

      // Store token and refresh token if login successful
      if (result.success && result.token) {
        localStorage.setItem("token", result.token);
        if (result.refreshToken)
          localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Failed to connect to server" };
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },

  async refresh(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken)
        return { success: false, error: "No refresh token available" };

      const response = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const result = await response.json();
      if (result.success && result.token) {
        localStorage.setItem("token", result.token);
        if (result.refreshToken)
          localStorage.setItem("refreshToken", result.refreshToken);
      }

      return result;
    } catch (error) {
      console.error("Refresh token error:", error);
      return { success: false, error: "Failed to refresh token" };
    }
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
