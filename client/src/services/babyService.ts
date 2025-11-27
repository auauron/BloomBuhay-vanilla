import { authService } from "./authService";

const API_URL = process.env.REACT_BACKEND_URL || "http://localhost:3000";

interface BabyDetails {
  motherhoodStage: string;
  babyName: string;
  gender: string;
}

export const babyService = {
  async getBabyDetails(): Promise<{
    success: boolean;
    baby?: { motherhoodStage: string; babyName: string; gender: string };
    error?: string;
  }> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const response = await fetch(`${API_URL}/api/mother-profiles/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result: { success: boolean; data?: any; error?: string } =
        await response.json();

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

      return { success: false, error: result.error || "No data" };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  },
  
  async updateBabyDetails(baby: {
    motherhoodStage: string;
    babyName: string;
    gender: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "No auth token" };

      const response = await fetch(`${API_URL}/api/mother-profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stage: baby.motherhoodStage,
          babyName: baby.babyName,
          babyGender: baby.gender,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Please fill out all the fields." };
    }
  },
};
