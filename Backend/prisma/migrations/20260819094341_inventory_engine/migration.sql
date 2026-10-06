-- CreateEnum
CREATE TYPE "StockTransactionType" AS ENUM ('INBOUND', 'OUTBOUND', 'TRANSFER', 'RETURN', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "StockTransferStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "inventory_balances" (
    "id" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "reservedQty" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transactions" (
    "id" UUID NOT NULL,
    "transactionNumber" VARCHAR(50) NOT NULL,
    "type" "StockTransactionType" NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,
    "balanceBefore" DECIMAL(18,3) NOT NULL,
    "balanceAfter" DECIMAL(18,3) NOT NULL,
    "referenceType" VARCHAR(50),
    "referenceId" UUID,
    "reason" VARCHAR(500),
    "performedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_cards" (
    "id" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "transactionType" "StockTransactionType" NOT NULL,
    "quantityIn" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "quantityOut" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "balance" DECIMAL(18,3) NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bin_cards" (
    "id" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "transactionType" "StockTransactionType" NOT NULL,
    "quantityIn" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "quantityOut" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "balance" DECIMAL(18,3) NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bin_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfers" (
    "id" UUID NOT NULL,
    "transferNumber" VARCHAR(50) NOT NULL,
    "sourceLocationId" UUID NOT NULL,
    "destinationLocationId" UUID NOT NULL,
    "status" "StockTransferStatus" NOT NULL DEFAULT 'DRAFT',
    "requestedById" UUID NOT NULL,
    "approvedById" UUID,
    "reason" VARCHAR(500),
    "remarks" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_transfer_items" (
    "id" UUID NOT NULL,
    "transferId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionId" UUID,

    CONSTRAINT "stock_transfer_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_balances_itemId_idx" ON "inventory_balances"("itemId");

-- CreateIndex
CREATE INDEX "inventory_balances_locationId_idx" ON "inventory_balances"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_balances_itemId_locationId_key" ON "inventory_balances"("itemId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_transactions_transactionNumber_key" ON "stock_transactions"("transactionNumber");

-- CreateIndex
CREATE INDEX "stock_transactions_itemId_locationId_createdAt_idx" ON "stock_transactions"("itemId", "locationId", "createdAt");

-- CreateIndex
CREATE INDEX "stock_transactions_type_createdAt_idx" ON "stock_transactions"("type", "createdAt");

-- CreateIndex
CREATE INDEX "stock_transactions_performedById_idx" ON "stock_transactions"("performedById");

-- CreateIndex
CREATE INDEX "stock_transactions_referenceType_referenceId_idx" ON "stock_transactions"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "stock_cards_itemId_transactionDate_idx" ON "stock_cards"("itemId", "transactionDate");

-- CreateIndex
CREATE INDEX "stock_cards_locationId_transactionDate_idx" ON "stock_cards"("locationId", "transactionDate");

-- CreateIndex
CREATE INDEX "bin_cards_locationId_transactionDate_idx" ON "bin_cards"("locationId", "transactionDate");

-- CreateIndex
CREATE INDEX "bin_cards_itemId_locationId_transactionDate_idx" ON "bin_cards"("itemId", "locationId", "transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "stock_transfers_transferNumber_key" ON "stock_transfers"("transferNumber");

-- CreateIndex
CREATE INDEX "stock_transfers_sourceLocationId_idx" ON "stock_transfers"("sourceLocationId");

-- CreateIndex
CREATE INDEX "stock_transfers_destinationLocationId_idx" ON "stock_transfers"("destinationLocationId");

-- CreateIndex
CREATE INDEX "stock_transfers_status_idx" ON "stock_transfers"("status");

-- CreateIndex
CREATE INDEX "stock_transfers_requestedById_idx" ON "stock_transfers"("requestedById");

-- CreateIndex
CREATE UNIQUE INDEX "stock_transfer_items_transactionId_key" ON "stock_transfer_items"("transactionId");

-- CreateIndex
CREATE INDEX "stock_transfer_items_itemId_idx" ON "stock_transfer_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "stock_transfer_items_transferId_itemId_key" ON "stock_transfer_items"("transferId", "itemId");

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_itemId_locationId_fkey" FOREIGN KEY ("itemId", "locationId") REFERENCES "inventory_balances"("itemId", "locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_cards" ADD CONSTRAINT "stock_cards_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_cards" ADD CONSTRAINT "stock_cards_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_cards" ADD CONSTRAINT "stock_cards_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "stock_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_cards" ADD CONSTRAINT "stock_cards_itemId_locationId_fkey" FOREIGN KEY ("itemId", "locationId") REFERENCES "inventory_balances"("itemId", "locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bin_cards" ADD CONSTRAINT "bin_cards_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bin_cards" ADD CONSTRAINT "bin_cards_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bin_cards" ADD CONSTRAINT "bin_cards_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "stock_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bin_cards" ADD CONSTRAINT "bin_cards_itemId_locationId_fkey" FOREIGN KEY ("itemId", "locationId") REFERENCES "inventory_balances"("itemId", "locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_sourceLocationId_fkey" FOREIGN KEY ("sourceLocationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_destinationLocationId_fkey" FOREIGN KEY ("destinationLocationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "stock_transfers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "stock_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
