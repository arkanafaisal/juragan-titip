-- CreateTable
CREATE TABLE "Consignment" (
    "id" SERIAL NOT NULL,
    "sum" INTEGER NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "lastRestock" TIMESTAMP(3) NOT NULL,
    "nextRestock" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Consignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consignment" ADD CONSTRAINT "Consignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consignment" ADD CONSTRAINT "Consignment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
