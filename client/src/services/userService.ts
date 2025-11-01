import { authService } from './authService';

const API_URL = 'http://localhost:3000/api/users';

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

interface GetProfileResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  profilePic?: string;
  password?: string;
  confirmPassword?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  user?: UserProfile;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const userService = {
  async getProfile(): Promise<GetProfileResponse> {
    try {
      const token = authService.getToken();
      if (!token) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success && result.user) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Failed to connect to server',
      };
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const token = authService.getToken();
      if (!token) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await fetch(`${API_URL}/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.user) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Failed to connect to server',
      };
    }
  },
};

