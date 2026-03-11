-- CreateTable
CREATE TABLE "Planner" (
    "id" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Planner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Planner" ADD CONSTRAINT "Planner_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
