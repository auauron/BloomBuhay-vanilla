/*
  Warnings:

  - You are about to drop the `(health_metrics)` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."(health_metrics)" DROP CONSTRAINT "(health_metrics)_motherId_fkey";

-- AlterTable
ALTER TABLE "planner_task" ALTER COLUMN "date" SET DATA TYPE TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "public"."(health_metrics)";

-- CreateTable
CREATE TABLE "health_metrics" (
    "id" SERIAL NOT NULL,
    "motherId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "change" TEXT,
    "trend" TEXT,
    "color" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_health_metrics_mother_id" ON "health_metrics"("motherId");

-- AddForeignKey
ALTER TABLE "health_metrics" ADD CONSTRAINT "health_metrics_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
