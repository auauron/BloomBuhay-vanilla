/*
  Warnings:

  - Added the required column `updatedAt` to the `feeding_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `growth_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sleep_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "feeding_logs" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "growth_records" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "sleep_logs" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
