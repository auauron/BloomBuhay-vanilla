/*
  Warnings:

  - You are about to drop the `baby_metrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."baby_metrics" DROP CONSTRAINT "baby_metrics_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."health_logs" DROP CONSTRAINT "health_logs_motherId_fkey";

-- DropTable
DROP TABLE "public"."baby_metrics";

-- DropTable
DROP TABLE "public"."health_logs";
