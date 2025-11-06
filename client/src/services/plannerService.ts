import { authService } from "./authService";

const API_URL = "http://localhost:3000/planner";

export interface PlannerTask {
    id: number;
    userId: number;
    title: string;
    description: string,
    date: string;
    isCompleted: boolean,
    createdAt: string;
}

export interface GetTasksResponse {
    success: boolean;
    data?: PlannerTask[],
    error?: string;
}

export interface CreateTaskRequest {
    title: string,
    description?: string;
    date: string;
}

export interface CreateTaskResponse {
    success: boolean,
    data?: PlannerTask;
    error?: string;
}

export interface UpdateTaskRequest {
    isCompleted: boolean
}

export interface UpdateTaskResponse {
    success: boolean,
    data?: PlannerTask;
    error?: string;
}

export interface DeleteTaskResponse {
    success: boolean,
    message?: string,
    error?: string;
}

export const plannerService = {
        //
}