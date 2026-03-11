-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "missingIngredients" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
