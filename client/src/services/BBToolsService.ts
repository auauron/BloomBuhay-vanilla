// src/services/BBToolsService.ts
import { authService } from "./authService";

const API_URL = "http://localhost:3000/api/bbtools";

export interface BBMetric {
  id: number;
  userId?: number;
  title: string;
  value: string;
  unit?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeedingLog {
  id: number;
  userId?: number;
  amount?: number; // ml or amount indicator
  method?: string; // e.g., "breast", "bottle"
  notes?: string;
  createdAt?: string;
}

export interface SleepLog {
  id: number;
  userId?: number;
  startAt?: string;
  endAt?: string;
  durationMinutes?: number;
  notes?: string;
  createdAt?: string;
}

export interface GrowthRecord {
  id: number;
  userId?: number;
  weight?: number; // kg
  height?: number; // cm / length
  headCircumference?: number; // cm
  notes?: string;
  createdAt?: string;
}

export interface GenericResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export interface GetBBToolsResponse {
  success: boolean;
  data?: {
    metrics?: BBMetric[];
    feedings?: FeedingLog[];
    sleeps?: SleepLog[];
    growths?: GrowthRecord[];
  };
  error?: string;
}

/* CREATE request shapes */
export interface CreateBBMetricRequest {
  title: string;
  value: string;
  unit?: string;
  notes?: string;
}

export interface CreateFeedingRequest {
  amount?: number;
  method?: string;
  notes?: string;
  occurredAt?: string;
}

export interface CreateSleepRequest {
  startAt: string;
  endAt?: string;
  notes?: string;
}

export interface CreateGrowthRequest {
  weight?: number;
  height?: number;
  headCircumference?: number;
  notes?: string;
}

export const bbtoolsService = {
  async getAll(): Promise<GetBBToolsResponse> {
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
      console.error("Get BB tools data error:", error);
      return { success: false, error: "Failed to fetch BB tools data" };
    }
  },

  /* Metrics CRUD */
  async createMetric(data: CreateBBMetricRequest): Promise<GenericResponse> {
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
      console.error("Create BB metric error:", error);
      return { success: false, error: "Failed to create BB metric" };
    }
  },

  async updateMetric(metricId: string, data: Partial<CreateBBMetricRequest>): Promise<GenericResponse> {
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
      console.error("Update BB metric error:", error);
      return { success: false, error: "Failed to update BB metric" };
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
      console.error("Delete BB metric error:", error);
      return { success: false, error: "Failed to delete BB metric" };
    }
  },

  /* Feedings, Sleeps, Growth */
  async addFeeding(data: CreateFeedingRequest): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/feedings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Add feeding error:", error);
      return { success: false, error: "Failed to add feeding" };
    }
  },

  async addSleep(data: CreateSleepRequest): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/sleeps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Add sleep error:", error);
      return { success: false, error: "Failed to add sleep log" };
    }
  },

  async addGrowth(data: CreateGrowthRequest): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/growths`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Add growth error:", error);
      return { success: false, error: "Failed to add growth record" };
    }
  },
};
