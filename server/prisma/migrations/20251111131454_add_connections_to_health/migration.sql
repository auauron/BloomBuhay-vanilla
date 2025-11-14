/*
  Warnings:

  - You are about to drop the `HealthMetric` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HealthMood` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HealthSymptom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."HealthMetric";

-- DropTable
DROP TABLE "public"."HealthMood";

-- DropTable
DROP TABLE "public"."HealthSymptom";

-- CreateTable
CREATE TABLE "(health_metrics)" (
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

    CONSTRAINT "(health_metrics)_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_moods" (
    "id" SERIAL NOT NULL,
    "motherId" INTEGER NOT NULL,
    "mood" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_moods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_symptoms" (
    "id" SERIAL NOT NULL,
    "motherId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "severity" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_symptoms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_health_metrics_mother_id" ON "(health_metrics)"("motherId");

-- CreateIndex
CREATE INDEX "idx_health_moods_mother_id" ON "health_moods"("motherId");

-- CreateIndex
CREATE INDEX "idx_health_symptoms_mother_id" ON "health_symptoms"("motherId");

-- AddForeignKey
ALTER TABLE "(health_metrics)" ADD CONSTRAINT "(health_metrics)_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_moods" ADD CONSTRAINT "health_moods_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_symptoms" ADD CONSTRAINT "health_symptoms_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
