/*
  Warnings:

  - The `severity` column on the `health_symptoms` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "health_symptoms" DROP COLUMN "severity",
ADD COLUMN     "severity" "Severity" NOT NULL DEFAULT 'low';
