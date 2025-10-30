-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('pregnant', 'postpartum', 'childcare');

-- CreateEnum
CREATE TYPE "BabyGender" AS ENUM ('male', 'female', 'unknown');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profilePic" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mother_profiles" (
    "id" SERIAL NOT NULL,
    "motherId" INTEGER NOT NULL,
    "babyName" TEXT,
    "lmpDate" TIMESTAMP(3) NOT NULL,
    "weeksPregnant" INTEGER NOT NULL,
    "weeksPostpartum" INTEGER NOT NULL,
    "babyAgeMonths" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "stage" "Stage" NOT NULL,
    "babyGender" "BabyGender" NOT NULL,

    CONSTRAINT "mother_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planner_task" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planner_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_logs" (
    "id" SERIAL NOT NULL,
    "motherId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "weight" DOUBLE PRECISION,
    "bloodPressure" TEXT,
    "heartRate" INTEGER,
    "mood" TEXT,
    "sleepHours" DOUBLE PRECISION,
    "waterIntake" DOUBLE PRECISION,
    "symptoms" TEXT,
    "notes" TEXT,
    "createdAt" DATE NOT NULL,

    CONSTRAINT "health_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolsLog" (
    "id" SERIAL NOT NULL,
    "motherId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "trimester" TEXT,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_entries" (
    "id" SERIAL NOT NULL,
    "motherId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "idx_mother_profiles_user_id" ON "mother_profiles"("motherId");

-- CreateIndex
CREATE INDEX "idx_planner_task_user_id" ON "planner_task"("userId");

-- CreateIndex
CREATE INDEX "idx_planner_task_date" ON "planner_task"("date");

-- CreateIndex
CREATE INDEX "idx_health_logs_mother_date" ON "health_logs"("motherId", "date");

-- CreateIndex
CREATE INDEX "idx_tools_logs_mother_id" ON "ToolsLog"("motherId");

-- CreateIndex
CREATE INDEX "idx_tools_logs_type" ON "ToolsLog"("type");

-- CreateIndex
CREATE INDEX "idx_articles_category" ON "articles"("category");

-- CreateIndex
CREATE INDEX "idx_journal_entries_mother_id" ON "journal_entries"("motherId");

-- AddForeignKey
ALTER TABLE "mother_profiles" ADD CONSTRAINT "mother_profiles_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planner_task" ADD CONSTRAINT "planner_task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_logs" ADD CONSTRAINT "health_logs_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolsLog" ADD CONSTRAINT "ToolsLog_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
