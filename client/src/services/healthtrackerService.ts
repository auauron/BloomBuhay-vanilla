import { authService } from "./authService";

const API_URL = "http://localhost:3000/api/healthtracker";

export interface HealthMetric {
  id: number;
  userId?: number;
  title: string;
  value: string;
  unit?: string;
  change?: string;
  trend?: "up" | "down" | "stable" | string;
  color?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthMood {
  id: number;
  userId?: number;
  mood: string;
  notes?: string;
  createdAt?: string;
}

export interface HealthSymptom {
  id: number;
  symptom: string;        // frontend mapped name
  intensity?: "Low" | "Medium" | "High" | string;
  notes?: string;
  resolved?: boolean;
  rawCreatedAt?: string;
  time?: string; // display time string
}

export interface GetHealthResponse {
  success: boolean;
  data?: {
    metrics?: HealthMetric[];
    moods?: HealthMood[];
    symptoms?: HealthSymptom[];
  };
  error?: string;
}

export interface CreateMetricRequest {
  title: string;
  value: string;
  unit?: string;
  change?: string;
  trend?: string;
  color?: string;
  category?: string;
}

export interface GenericResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export const healthtrackerService = {
  async getAll(): Promise<GetHealthResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not Authenticated" };

      const res = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (error) {
      console.error("Get health data error:", error);
      return { success: false, error: "Failed to fetch health data" };
    }
  },

  async createMetric(data: CreateMetricRequest): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Create metric error:", error);
      return { success: false, error: "Failed to create metric" };
    }
  },

  async updateMetric(metricId: string, data: Partial<CreateMetricRequest>): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/metrics/${metricId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Update metric error:", error);
      return { success: false, error: "Failed to update metric" };
    }
  },

  async deleteMetric(metricId: string): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/metrics/${metricId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (error) {
      console.error("Delete metric error:", error);
      return { success: false, error: "Failed to delete metric" };
    }
  },

  /* ---------- Symptom helpers ---------- */

  // Frontend should call this with the frontend shape if possible.
  async addSymptom(data: {
    symptom: string;
    intensity?: "Low" | "Medium" | "High" | string;
    date?: string; // YYYY-MM-DD
    time?: string; // HH:MM or "hh:mm AM/PM"
    resolved?: boolean;
    notes?: string;
  }): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      // Map to server-friendly payload (server accepts both shapes)
      const payload: any = {
        // server accepts 'symptom' or legacy 'name'
        symptom: data.symptom,
        intensity: data.intensity,
        date: data.date,
        time: data.time,
        resolved: data.resolved,
        notes: data.notes,
      };

      const res = await fetch(`${API_URL}/symptoms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      return await res.json();
    } catch (error) {
      console.error("Add symptom error:", error);
      return { success: false, error: "Failed to add symptom" };
    }
  },

  async updateSymptom(symptomId: string | number, data: {
    symptom?: string;
    intensity?: "Low" | "Medium" | "High" | string;
    date?: string;
    time?: string;
    resolved?: boolean;
    notes?: string;
  }): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/symptoms/${symptomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Update symptom error:", error);
      return { success: false, error: "Failed to update symptom" };
    }
  },

  async deleteSymptom(symptomId: string | number): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/symptoms/${symptomId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (error) {
      console.error("Delete symptom error:", error);
      return { success: false, error: "Failed to delete symptom" };
    }
  },
};