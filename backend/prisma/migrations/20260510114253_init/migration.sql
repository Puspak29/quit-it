-- CreateEnum
CREATE TYPE "AddictionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('COACH', 'URGE', 'INSIGHT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "fcmToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addiction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "triggers" JSONB NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AddictionStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addiction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relapse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addictionId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "note" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "context" JSONB,

    CONSTRAINT "Relapse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "moodScore" INTEGER NOT NULL,
    "note" TEXT,
    "didRelapse" BOOLEAN NOT NULL DEFAULT false,
    "streak" INTEGER NOT NULL,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "context" JSONB,
    "type" "MessageType" NOT NULL DEFAULT 'COACH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "Addiction_userId_idx" ON "Addiction"("userId");

-- CreateIndex
CREATE INDEX "Relapse_userId_occurredAt_idx" ON "Relapse"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "Relapse_addictionId_idx" ON "Relapse"("addictionId");

-- CreateIndex
CREATE INDEX "Checkin_userId_checkedAt_idx" ON "Checkin"("userId", "checkedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Checkin_userId_checkedAt_key" ON "Checkin"("userId", "checkedAt");

-- CreateIndex
CREATE INDEX "AiMessage_userId_createdAt_idx" ON "AiMessage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AiMessage_userId_type_idx" ON "AiMessage"("userId", "type");

-- AddForeignKey
ALTER TABLE "Addiction" ADD CONSTRAINT "Addiction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relapse" ADD CONSTRAINT "Relapse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relapse" ADD CONSTRAINT "Relapse_addictionId_fkey" FOREIGN KEY ("addictionId") REFERENCES "Addiction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
