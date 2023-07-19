/*
  Warnings:

  - You are about to drop the column `hashIssuedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hashIssuedAt",
ADD COLUMN     "hashedRt" TEXT;
