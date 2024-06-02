-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");


-- Data
INSERT INTO users (username, name, password, email, role) VALUES
('user1', 'name1', '$2b$10$EIX7v5FA59vOanU.3yU5pO9bypHd9g5U.zf6TNTUOKQ3Sj91s5Z8W', 'user1@example.com', 'ADMIN'),
('user2', 'name2','$2b$10$EIX7v5FA59vOanU.3yU5pO9bypHd9g5U.zf6TNTUOKQ3Sj91s5Z8W', 'user2@example.com',  'USER');