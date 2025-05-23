-- CreateTable
CREATE TABLE "URLs" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessCount" INTEGER NOT NULL,

    CONSTRAINT "URLs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "URLs_url_key" ON "URLs"("url");

-- CreateIndex
CREATE UNIQUE INDEX "URLs_shortCode_key" ON "URLs"("shortCode");
