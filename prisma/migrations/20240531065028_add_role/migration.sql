/*
  Warnings:

  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_id_key";

-- AlterTable
CREATE SEQUENCE users_id_seq;
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq');
ALTER SEQUENCE users_id_seq OWNED BY "users"."id";
