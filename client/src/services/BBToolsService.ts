// src/services/BBToolsService.ts
import { authService } from "./authService";

const API_URL = "http://localhost:3000/api/bbtools";


export interface Vaccination {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  notes: string;
}

export interface CreateVaccinationRequest {
  name: string;
  dueDate: string;
  completed?: boolean;
  completedDate?: string;
  notes: string;
}

export interface ScheduleEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "sleep" | "activity" | "feeding";
  description: string;
  notes: string;
}

export interface CreateScheduleRequest {
  date: string;
  startTime: string;
  endTime: string;
  type: "sleep" | "activity" | "feeding";
  description: string;
  notes: string;
}

export interface NutritionEntry {
  id: string;
  date: string;
  time: string;
  food: string;
  amount: string;
  notes: string;
}

export interface CreateNutritionRequest {
  date: string;
  time: string;
  food: string;
  amount: string;
  notes: string;
}

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
  occurredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SleepLog {
  id: number;
  userId?: number;
  startAt: string; 
  endAt?: string;
  durationMinutes?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GrowthRecord {
  id: number;
  userId?: number;
  weight?: number; // kg
  height?: number; // cm / length
  headCircumference?: number; // cm
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface PostpartumToolsProps {
  feedings?: FeedingLog[];
  sleeps?: SleepLog[];
  growths?: GrowthRecord[];
  onRefreshData?: () => void;
}

export interface SleepTrackerProps {
  sleeps: SleepLog[];
  onRefresh?: () => void;
}

export interface SleepSessionForm {
  startTime: string;
  endTime: string;  
  notes: string;
}

export interface GrowthChartProps {
  growths?: GrowthRecord[];
  onRefresh?: () => void;
}

export interface GrowthRecordForm {
  date: string;
  age: number;
  weight: number;
  height: number;
  headCircumference?: number;
  notes: string;
}

export interface LocalGrowthRecord {
  id: string;
  date: string;
  age: number;
  weight: number;
  height: number;
  headCircumference?: number;
  notes: string;
}

export interface FeedingLogProps {
  feedings?: FeedingLog[];
  onRefresh?: () => void;
}

export interface FeedingSessionForm {
  type: 'breast' | 'formula' | 'solid';
  side?: 'left' | 'right' | 'both';
  amount?: number;
  duration?: number;
  notes: string;
}

export interface LocalFeedingSession {
  id: string;
  type: 'breast' | 'formula' | 'solid';
  side?: string;
  amount?: number;
  startTime: string;
  endTime: string;
  duration: number;
  notes: string;
  rawTimestamp: string;
}

// Local optimistic state
export interface LocalSleepSession {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  duration: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string;
  rawStartAt: string;
  rawEndAt?: string | null;
}
export interface Contraction {
  id?: number;
  startTime: string;
  endTime: string;
  duration: number;
  frequency: number;
}
export interface DueDateLog {
  id?: number;
  lmpDate: string; // ISO string
  weeksPregnant: number;
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

  async updateSleep(sleepId: string, data: Partial<CreateSleepRequest>): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/sleeps/${sleepId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Update sleep error:", error);
      return { success: false, error: "Failed to update sleep log" };
    }
  },

  async deleteSleep(sleepId: string): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/sleeps/${sleepId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (error) {
      console.error("Delete sleep error:", error);
      return { success: false, error: "Failed to delete sleep log" };
    }
  },

  async updateFeeding(feedingId: string, data: Partial<CreateFeedingRequest>): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/feedings/${feedingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Update feeding error:", error);
      return { success: false, error: "Failed to update feeding log" };
    }
  },

  async deleteFeeding(feedingId: string): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/feedings/${feedingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (error) {
      console.error("Delete feeding error:", error);
      return { success: false, error: "Failed to delete feeding log" };
    }
  },

  async updateGrowth(growthId: string, data: Partial<CreateGrowthRequest>): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/growths/${growthId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Update growth error:", error);
      return { success: false, error: "Failed to update growth record" };
    }
  },

  async deleteGrowth(growthId: string): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/growths/${growthId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (error) {
      console.error("Delete growth error:", error);
      return { success: false, error: "Failed to delete growth record" };
    }
  },
    async getContractions(): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/contractions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (err) {
      console.error("Get contractions error:", err);
      return { success: false, error: "Failed to fetch contractions" };
    }
  },

  async createContraction(data: Contraction): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/contractions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (err) {
      console.error("Create contraction error:", err);
      return { success: false, error: "Failed to create contraction" };
    }
  },

  async deleteContraction(id: number): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/contractions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (err) {
      console.error("Delete contraction error:", err);
      return { success: false, error: "Failed to delete contraction" };
    }
  },

    async getDueDate(): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/duedate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (err) {
      console.error("Get due date log error:", err);
      return { success: false, error: "Failed to fetch due date log" };
    }
  },

  async saveDueDate(data: DueDateLog): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/duedate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (err) {
      console.error("Save due date log error:", err);
      return { success: false, error: "Failed to save due date log" };
    }
  },
  /* Nutrition CRUD */
  async getNutritionLogs(): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/nutrition`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (error) {
      console.error("Get nutrition logs error:", error);
      return { success: false, error: "Failed to fetch nutrition logs" };
    }
  },

  async addNutrition(data: CreateNutritionRequest): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/nutrition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Add nutrition error:", error);
      return { success: false, error: "Failed to add nutrition entry" };
    }
  },

  async updateNutrition(nutritionId: string, data: Partial<CreateNutritionRequest>): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/nutrition/${nutritionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (error) {
      console.error("Update nutrition error:", error);
      return { success: false, error: "Failed to update nutrition entry" };
    }
  },

  async deleteNutrition(nutritionId: string): Promise<GenericResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const res = await fetch(`${API_URL}/tools/nutrition/${nutritionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return await res.json();
    } catch (error) {
      console.error("Delete nutrition error:", error);
      return { success: false, error: "Failed to delete nutrition entry" };
    }
  },

    /* Schedule CRUD */
    async getScheduleEntries(): Promise<GenericResponse> {
      try {
        const token = authService.getToken();
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/tools/schedule`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        return await res.json();
      } catch (error) {
        console.error("Get schedule entries error:", error);
        return { success: false, error: "Failed to fetch schedule entries" };
      }
    },

    async addSchedule(data: CreateScheduleRequest): Promise<GenericResponse> {
      try {
        const token = authService.getToken();
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/tools/schedule`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        return await res.json();
      } catch (error) {
        console.error("Add schedule error:", error);
        return { success: false, error: "Failed to add schedule entry" };
      }
    },

    async updateSchedule(scheduleId: string, data: Partial<CreateScheduleRequest>): Promise<GenericResponse> {
      try {
        const token = authService.getToken();
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/tools/schedule/${scheduleId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        return await res.json();
      } catch (error) {
        console.error("Update schedule error:", error);
        return { success: false, error: "Failed to update schedule entry" };
      }
    },

    async deleteSchedule(scheduleId: string): Promise<GenericResponse> {
      try {
        const token = authService.getToken();
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/tools/schedule/${scheduleId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        return await res.json();
      } catch (error) {
        console.error("Delete schedule error:", error);
        return { success: false, error: "Failed to delete schedule entry" };
      }
    },
    /* Vaccination CRUD */
    async getVaccinations(): Promise<GenericResponse> {
      try {
        const token = authService.getToken();
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/tools/vaccinations`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        return await res.json();
      } catch (error) {
        console.error("Get vaccinations error:", error);
        return { success: false, error: "Failed to fetch vaccinations" };
      }
    },

    async addVaccination(data: CreateVaccinationRequest): Promise<GenericResponse> {
      try {
        const token = authService.getToken();
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/tools/vaccinations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        return await res.json();
      } catch (error) {
        console.error("Add vaccination error:", error);
        return { success: false, error: "Failed to add vaccination" };
      }
    },

    async updateVaccination(vaccinationId: string, data: Partial<CreateVaccinationRequest>): Promise<GenericResponse> {
      try {
        const token = authService.getToken();
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/tools/vaccinations/${vaccinationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        return await res.json();
      } catch (error) {
        console.error("Update vaccination error:", error);
        return { success: false, error: "Failed to update vaccination" };
      }
    },

    async deleteVaccination(vaccinationId: string): Promise<GenericResponse> {
      try {
        const token = authService.getToken();
        if (!token) return { success: false, error: "Not authenticated" };

        const res = await fetch(`${API_URL}/tools/vaccinations/${vaccinationId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        return await res.json();
      } catch (error) {
        console.error("Delete vaccination error:", error);
        return { success: false, error: "Failed to delete vaccination" };
      }
    },
  };


