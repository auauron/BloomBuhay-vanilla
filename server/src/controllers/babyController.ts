import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; 
import { BabySignupRequest } from '../types/Baby';

const prisma = new PrismaClient();

export const createBaby = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stage, babyName, babyGender, weeksPregnant, lmpDate }: BabySignupRequest = req.body;
    const motherId = (req as any).user.id; 

    const existingProfile = await prisma.motherProfiles.findFirst({
      where: { motherId },
    });
    if (existingProfile) {
      res.status(400).json({ success: false, error: 'Mother profile already exists' });
      return;
    }

    const motherProfile = await prisma.motherProfiles.create({
      data: {
        motherId,  
        stage,
        babyName,
        babyGender,
        weeksPregnant,
        lmpDate: lmpDate ? new Date(lmpDate) : undefined,
      },
    });

    res.status(201).json({ success: true, data: motherProfile });
  } catch (error) {
    console.error('Error creating mother profile:', error);
    res.status(500).json({ success: false, error: 'Failed to create mother profile' });
  }
};

export const getBaby = async (req: Request, res: Response): Promise<void> => {
  try {
    const motherId = (req as any).user.id;  

    const motherProfile = await prisma.motherProfiles.findFirst({
      where: { motherId }, 
    });

    if (!motherProfile) {
      res.status(404).json({ success: false, error: 'No mother profile found' });
      return;
    }

    res.json({ success: true, data: motherProfile });
  } catch (error) {
    console.error('Error fetching mother profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch mother profile' });
  }
};