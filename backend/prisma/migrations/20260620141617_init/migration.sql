-- CreateEnum
CREATE TYPE "roles" AS ENUM ('Admin', 'Teacher', 'Student');

-- CreateEnum
CREATE TYPE "user_statuses" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "student_levels" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- CreateEnum
CREATE TYPE "class_statuses" AS ENUM ('در حال ثبت‌نام', 'فعال', 'تکمیل شده', 'لغو شده');

-- CreateEnum
CREATE TYPE "enrollment_statuses" AS ENUM ('در حال تحصیل', 'تکمیل شده', 'انصرافی');

-- CreateEnum
CREATE TYPE "book_categories" AS ENUM ('IELTS', 'TOEFL', 'Conversation', 'Grammar', 'Vocabulary', 'Listening', 'Reading', 'Writing', 'Kids', 'General');

-- CreateEnum
CREATE TYPE "book_levels" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'All');

-- CreateEnum
CREATE TYPE "book_languages" AS ENUM ('Persian', 'English', 'French', 'German', 'Arabic');

-- CreateEnum
CREATE TYPE "book_statuses" AS ENUM ('available', 'unavailable');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "employeeCode" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "roles" NOT NULL DEFAULT 'Student',
    "email" VARCHAR(255),
    "phone" TEXT,
    "address" TEXT,
    "profileImage" VARCHAR(255) NOT NULL DEFAULT 'default-avatar.png',
    "status" "user_statuses" NOT NULL DEFAULT 'active',
    "birthday" VARCHAR(10),
    "passwordChangedAt" TIMESTAMP(3),
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialization" TEXT,
    "hireDate" TIMESTAMP(3),
    "salary" DECIMAL(12,2),
    "resume" TEXT,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" "student_levels" NOT NULL DEFAULT 'A1',
    "emergencyPhone" TEXT,
    "registeredDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "level" "student_levels" NOT NULL DEFAULT 'A1',
    "teacherId" TEXT NOT NULL,
    "term" VARCHAR(50) NOT NULL,
    "tuition" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "schedule" VARCHAR(100) NOT NULL,
    "room" VARCHAR(50) NOT NULL,
    "status" "class_statuses" NOT NULL DEFAULT 'در حال ثبت‌نام',
    "createdById" TEXT NOT NULL,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "capacity" INTEGER NOT NULL DEFAULT 10,
    "totalSessions" INTEGER NOT NULL DEFAULT 12,
    "description" VARCHAR(500),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_sessions" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "sessionNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "topic" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "class_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "enrollDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "enrollment_statuses" NOT NULL DEFAULT 'در حال تحصیل',

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "category" "book_categories" NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "level" "book_levels" NOT NULL DEFAULT 'All',
    "price" DECIMAL(12,2) NOT NULL,
    "img" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(500),
    "language" "book_languages" NOT NULL DEFAULT 'Persian',
    "status" "book_statuses" NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeCode_key" ON "users"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_employeeCode_idx" ON "users"("employeeCode");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_userId_key" ON "teachers"("userId");

-- CreateIndex
CREATE INDEX "teachers_userId_idx" ON "teachers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE INDEX "students_userId_idx" ON "students"("userId");

-- CreateIndex
CREATE INDEX "students_level_idx" ON "students"("level");

-- CreateIndex
CREATE INDEX "classes_teacherId_idx" ON "classes"("teacherId");

-- CreateIndex
CREATE INDEX "classes_createdById_idx" ON "classes"("createdById");

-- CreateIndex
CREATE INDEX "classes_term_idx" ON "classes"("term");

-- CreateIndex
CREATE INDEX "classes_level_idx" ON "classes"("level");

-- CreateIndex
CREATE INDEX "classes_status_idx" ON "classes"("status");

-- CreateIndex
CREATE INDEX "class_sessions_classId_idx" ON "class_sessions"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "class_sessions_classId_sessionNumber_key" ON "class_sessions"("classId", "sessionNumber");

-- CreateIndex
CREATE INDEX "enrollments_userId_idx" ON "enrollments"("userId");

-- CreateIndex
CREATE INDEX "enrollments_classId_idx" ON "enrollments"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_userId_classId_key" ON "enrollments"("userId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "books_productId_key" ON "books"("productId");

-- CreateIndex
CREATE INDEX "books_category_idx" ON "books"("category");

-- CreateIndex
CREATE INDEX "books_level_idx" ON "books"("level");

-- CreateIndex
CREATE INDEX "books_status_idx" ON "books"("status");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
