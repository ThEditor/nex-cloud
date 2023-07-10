/*
  Warnings:

  - Added the required column `releasedAt` to the `songs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "songs" ADD COLUMN     "releasedAt" TIMESTAMP(3) NOT NULL;
