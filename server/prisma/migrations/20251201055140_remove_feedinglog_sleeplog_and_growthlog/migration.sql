/*
  Warnings:

  - You are about to drop the `feeding_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `growth_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sleep_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."feeding_logs" DROP CONSTRAINT "feeding_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."growth_records" DROP CONSTRAINT "growth_records_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sleep_logs" DROP CONSTRAINT "sleep_logs_userId_fkey";

-- DropTable
DROP TABLE "public"."feeding_logs";

-- DropTable
DROP TABLE "public"."growth_records";

-- DropTable
DROP TABLE "public"."sleep_logs";
