/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Meal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Meal_name_key" ON "Meal"("name");
