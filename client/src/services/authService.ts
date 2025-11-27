import { SignupRequest, LoginRequest, AuthResponse } from "../types/auth";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:10000/api/auth";

export const authService = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

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
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

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
