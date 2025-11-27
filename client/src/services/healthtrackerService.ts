import { authService } from "./authService";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/healthtracker` || "http://localhost:3000";

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
  createdAt: string;
}

export interface HealthSymptom {
  id: number;
  symptom: string;
  intensity?: "Low" | "Medium" | "High" | string;
  notes?: string;
  resolved?: boolean;
  rawCreatedAt?: string;
  time?: string;
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

  /* ---------- Metrics ---------- */
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

  /* ---------- Moods (CRUD) ---------- */
  async addMood(data: { mood: string; notes?: string }): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/moods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (err) {
      console.error("Add mood error:", err);
      return { success: false, error: "Failed to create mood" };
    }
  },

  async updateMood(id: number | string, data: { mood?: string; notes?: string }): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/moods/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (err) {
      console.error("Update mood error:", err);
      return { success: false, error: "Failed to update mood" };
    }
  },

  async deleteMood(id: number | string): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/moods/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (err) {
      console.error("Delete mood error:", err);
      return { success: false, error: "Failed to delete mood" };
    }
  },

  /* ---------- Symptom helpers ---------- */
  async addSymptom(data: {
    symptom: string;
    intensity?: "Low" | "Medium" | "High" | string;
    date?: string;
    time?: string;
    resolved?: boolean;
    notes?: string;
  }): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const payload: any = {
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