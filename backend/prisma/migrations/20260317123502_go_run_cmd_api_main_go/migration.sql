-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Other',
ADD COLUMN     "quantity" TEXT,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "ShoppingItem" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Other';
