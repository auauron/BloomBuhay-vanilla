export interface Baby {
  id: number;
  userId: number; 
  stage: 'pregnant' | 'postpartum' | 'childcare';
  babyName: string;
  babyGender: 'male' | 'female' | 'unknown';
  weeksPregnant?: number; 
  lmpDate?: Date; 
  createdAt: Date;
  updatedAt: Date;
}
export interface BabySignupRequest {
  stage: 'pregnant' | 'postpartum' | 'childcare';
  babyName: string;
  babyGender: 'male' | 'female' | 'unknown';
  weeksPregnant?: number;
  lmpDate?: string;
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
