-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "pid" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "perform_time" TIMESTAMP(3),
    "create_time" TIMESTAMP(3),
    "cancel_time" TIMESTAMP(3),
    "state" INTEGER NOT NULL,
    "reason" INTEGER,
    "userId" INTEGER,
    "courseId" INTEGER,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_pid_key" ON "Transaction"("pid");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
