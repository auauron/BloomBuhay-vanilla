// frontend/src/services/babyService.ts
import { authService } from './authService';

interface BabyDetails {
  motherhoodStage: string;
  babyName: string;
  gender: string;
}

export const babyService = {
  async getBabyDetails(): Promise<{ success: boolean; baby?: BabyDetails; error?: string }> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: 'No auth token' };

      const response = await fetch('/api/mother-profiles', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result: { success: boolean; data?: any; error?: string } = await response.json();

      if (result.success && result.data) {
        return {
          success: true,
          baby: {
            motherhoodStage: result.data.stage, 
            babyName: result.data.babyName,
            gender: result.data.babyGender,
          },
        };
      }
      return { success: false, error: result.error || 'No data' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },
};