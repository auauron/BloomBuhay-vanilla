/*
  Warnings:

  - Added the required column `updatedAt` to the `health_symptoms` table without a default value. This is not possible if the table is not empty.
  - Made the column `severity` on table `health_symptoms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "health_symptoms" ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "severity" SET NOT NULL,
ALTER COLUMN "severity" SET DEFAULT 'low',
ALTER COLUMN "severity" SET DATA TYPE TEXT;
