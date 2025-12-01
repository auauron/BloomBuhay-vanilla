/*
  Warnings:

  - The `severity` column on the `health_symptoms` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "health_symptoms" DROP COLUMN "severity",
ADD COLUMN     "severity" TEXT NOT NULL DEFAULT 'low';

-- DropEnum
DROP TYPE "public"."Severity";
