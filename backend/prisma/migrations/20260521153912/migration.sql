/*
  Warnings:

  - You are about to drop the column `sum` on the `Consignment` table. All the data in the column will be lost.
  - You are about to alter the column `lat` on the `Consignment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,6)`.
  - You are about to alter the column `lng` on the `Consignment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(9,6)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(63)` to `VarChar(60)`.
  - Added the required column `amount` to the `Consignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Consignment" DROP CONSTRAINT "Consignment_productId_fkey";

-- DropForeignKey
ALTER TABLE "Consignment" DROP CONSTRAINT "Consignment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- AlterTable
ALTER TABLE "Consignment" DROP COLUMN "sum",
ADD COLUMN     "amount" INTEGER NOT NULL,
ALTER COLUMN "lat" SET DATA TYPE DECIMAL(9,6),
ALTER COLUMN "lng" SET DATA TYPE DECIMAL(9,6);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE VARCHAR(60);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consignment" ADD CONSTRAINT "Consignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consignment" ADD CONSTRAINT "Consignment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
