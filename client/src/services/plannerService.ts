import { authService } from "./authService";
import { Task, BloomDate, BloomTime } from "../types/plan";

const API_URL = "http://localhost:3000/api/planner";

export interface GetTasksResponse {
  success: boolean;
  data?: Task[];
  error?: string;
}

interface CreateTaskRequest {
  title: string;
  description: string;
  startDate: BloomDate;
  endDate: BloomDate | null;
  days: number[];
  interval: number;
  time: BloomTime | null;
  dateCreated: BloomDate;
}

export interface CreateTaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
}

interface UpdateTaskRequest {
  isCompleted: boolean;
  title: string;
  description: string;
  startDate: BloomDate;
  endDate: BloomDate | null;
  days: number[];
  interval: number;
  time: BloomTime | null;
  updatedAt: BloomDate;
}

export interface UpdateTaskResponse {
  success: boolean;
  data?: Task;
  error?: string;
}

export interface DeleteTaskResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const plannerService = {
  async getTasks(): Promise<GetTasksResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not Authenticated" };

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const result: GetTasksResponse = await response.json();
      return result;
    } catch (error) {
      console.error("Get tasks error", error);
      return { success: false, error: "Failed to fetch tasks" };
    }
  },

  async createTask(data: CreateTaskRequest): Promise<CreateTaskResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      })

      const result: CreateTaskResponse = await response.json();
      return result;
    } catch (error) {
      console.error("Create task error:", error);
      return { success: false, error: "Failed to create task" };
    }
  },

  async updateTask(taskId: number, data: UpdateTaskRequest): Promise<UpdateTaskResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Not authenticated" };

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result: UpdateTaskResponse = await response.json();
      return result
    } catch (error) {
      console.error("Update task error:", error);
      return { success: false, error: "Failed to update task" };
    }
  },

  async deleteTask(taskId: number): Promise<DeleteTaskResponse> {
    try {
      const token = authService.getToken();
      if (!token) return { success: false, error: "Failed to delete task" }

      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Delete task error:", error);
      return { success: false, error: "Failed to delete task" }
    }
  }
}