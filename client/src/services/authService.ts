import { SignupRequest, LoginRequest, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:3000/api/auth'; 

export const authService = {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      // Store token if signup successful
      if (result.success && result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'Failed to connect to server',
      };
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      // Store token if login successful
      if (result.success && result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Failed to connect to server',
      };
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};