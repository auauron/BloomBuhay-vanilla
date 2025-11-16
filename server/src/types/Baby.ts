// backend/types/Baby.ts
export interface Baby {
  id: number;
  userId: number; // Links to User table
  stage: 'pregnant' | 'postpartum' | 'childcare';
  babyName: string;
  babyGender: 'male' | 'female' | 'unknown';
  weeksPregnant?: number; // Optional for pregnancy
  lmpDate?: Date; // Optional for pregnancy
  createdAt: Date;
  updatedAt: Date;
}

export interface BabySignupRequest {
  stage: 'pregnant' | 'postpartum' | 'childcare';
  babyName: string;
  babyGender: 'male' | 'female' | 'unknown';
  weeksPregnant?: number;
  lmpDate?: string; // ISO string for dates
}

export interface BabyResponse {
  id: number;
  stage: string;
  babyName: string;
  babyGender: string;
  weeksPregnant?: number;
  lmpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MotherProfileResponse {
  success: boolean;
  data?: BabyResponse;
  error?: string;
}