import { authService } from "./authService";

import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/users`;

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetProfileResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  profilePic?: string;
  password?: string;
  confirmPassword?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface DeleteAccountResponse {
  success: boolean;
  error?: string;
  message?: string;
}

export const userService = {
  async getProfile(): Promise<GetProfileResponse> {
    try {
      const token = authService.getToken();
      if (!token) {
        return {
          success: false,
          error: "Not authenticated",
        };
      }

      const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success && result.user) {
        // Update stored user data
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Get profile error:", error);
      return {
        success: false,
        error: "Failed to connect to server",
      };
    }
  },

  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    try {
      const token = authService.getToken();
      if (!token) {
        return {
          success: false,
          error: "Not authenticated",
        };
      }

      const response = await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.user) {
        // Update stored user data
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        error: "Failed to update profile",
      };
    }
  },

  async deleteAccount(password: string): Promise<DeleteAccountResponse> {
    try {
      const token = authService.getToken();
      if (!token) {
        return {
          success: false,
          error: "Not authenticated",
        };
      }

      const response = await fetch(`${API_URL}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        // Clear all stored data on successful deletion
        localStorage.clear();
        // Also clear auth service state
        authService.logout();
      }

      return result;
    } catch (error) {
      console.error("Delete account error:", error);
      return {
        success: false,
        error: "Failed to delete account",
      };
    }
  },
};
