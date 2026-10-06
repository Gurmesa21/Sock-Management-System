-- CreateEnum
CREATE TYPE "StockTakingStatus" AS ENUM ('CREATED', 'COUNTING', 'COUNTED', 'INVESTIGATING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ADJUSTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "stock_takings" (
    "id" UUID NOT NULL,
    "sessionNumber" VARCHAR(50) NOT NULL,
    "storeId" UUID NOT NULL,
    "startedById" UUID NOT NULL,
    "status" "StockTakingStatus" NOT NULL DEFAULT 'CREATED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "remarks" VARCHAR(500),

    CONSTRAINT "stock_takings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_counts" (
    "id" UUID NOT NULL,
    "stockTakingId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "systemQuantity" DECIMAL(14,3) NOT NULL,
    "physicalQuantity" DECIMAL(14,3) NOT NULL,
    "countedById" UUID NOT NULL,
    "countedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" VARCHAR(500),

    CONSTRAINT "stock_counts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_discrepancies" (
    "id" UUID NOT NULL,
    "stockTakingId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "systemQuantity" DECIMAL(14,3) NOT NULL,
    "physicalQuantity" DECIMAL(14,3) NOT NULL,
    "difference" DECIMAL(14,3) NOT NULL,
    "reason" VARCHAR(255),
    "investigation" VARCHAR(1000),
    "investigatedById" UUID,
    "investigatedAt" TIMESTAMP(3),
    "status" VARCHAR(30) NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "stock_discrepancies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_adjustments" (
    "id" UUID NOT NULL,
    "adjustmentNumber" VARCHAR(50) NOT NULL,
    "discrepancyId" UUID,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "direction" VARCHAR(20) NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING_APPROVAL',
    "requestedById" UUID NOT NULL,
    "approvedById" UUID,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" VARCHAR(500),

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_batches" (
    "id" UUID NOT NULL,
    "batchNumber" VARCHAR(100) NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "manufacturingDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "damaged" BOOLEAN NOT NULL DEFAULT false,
    "obsolete" BOOLEAN NOT NULL DEFAULT false,
    "remarks" VARCHAR(500),

    CONSTRAINT "stock_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disposal_requests" (
    "id" UUID NOT NULL,
    "requestNumber" VARCHAR(50) NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    "requestedById" UUID NOT NULL,
    "inspectedById" UUID,
    "approvedById" UUID,
    "inspectionResult" VARCHAR(1000),
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspectedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "disposal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disposal_approvals" (
    "id" UUID NOT NULL,
    "disposalRequestId" UUID NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "approvedById" UUID NOT NULL,
    "remarks" VARCHAR(500),
    "approvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disposal_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disposal_records" (
    "id" UUID NOT NULL,
    "disposalRequestId" UUID NOT NULL,
    "disposalNumber" VARCHAR(50) NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "disposalMethod" VARCHAR(100) NOT NULL,
    "disposedById" UUID NOT NULL,
    "disposedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" VARCHAR(500),

    CONSTRAINT "disposal_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_takings_sessionNumber_key" ON "stock_takings"("sessionNumber");

-- CreateIndex
CREATE INDEX "stock_takings_storeId_idx" ON "stock_takings"("storeId");

-- CreateIndex
CREATE INDEX "stock_takings_startedById_idx" ON "stock_takings"("startedById");

-- CreateIndex
CREATE INDEX "stock_takings_status_idx" ON "stock_takings"("status");

-- CreateIndex
CREATE INDEX "stock_takings_startedAt_idx" ON "stock_takings"("startedAt");

-- CreateIndex
CREATE INDEX "stock_counts_itemId_idx" ON "stock_counts"("itemId");

-- CreateIndex
CREATE INDEX "stock_counts_locationId_idx" ON "stock_counts"("locationId");

-- CreateIndex
CREATE INDEX "stock_counts_countedById_idx" ON "stock_counts"("countedById");

-- CreateIndex
CREATE UNIQUE INDEX "stock_counts_stockTakingId_itemId_locationId_key" ON "stock_counts"("stockTakingId", "itemId", "locationId");

-- CreateIndex
CREATE INDEX "stock_discrepancies_stockTakingId_idx" ON "stock_discrepancies"("stockTakingId");

-- CreateIndex
CREATE INDEX "stock_discrepancies_itemId_idx" ON "stock_discrepancies"("itemId");

-- CreateIndex
CREATE INDEX "stock_discrepancies_locationId_idx" ON "stock_discrepancies"("locationId");

-- CreateIndex
CREATE INDEX "stock_discrepancies_status_idx" ON "stock_discrepancies"("status");

-- CreateIndex
CREATE UNIQUE INDEX "stock_adjustments_adjustmentNumber_key" ON "stock_adjustments"("adjustmentNumber");

-- CreateIndex
CREATE INDEX "stock_adjustments_discrepancyId_idx" ON "stock_adjustments"("discrepancyId");

-- CreateIndex
CREATE INDEX "stock_adjustments_itemId_idx" ON "stock_adjustments"("itemId");

-- CreateIndex
CREATE INDEX "stock_adjustments_locationId_idx" ON "stock_adjustments"("locationId");

-- CreateIndex
CREATE INDEX "stock_adjustments_status_idx" ON "stock_adjustments"("status");

-- CreateIndex
CREATE INDEX "stock_batches_itemId_idx" ON "stock_batches"("itemId");

-- CreateIndex
CREATE INDEX "stock_batches_locationId_idx" ON "stock_batches"("locationId");

-- CreateIndex
CREATE INDEX "stock_batches_expiryDate_idx" ON "stock_batches"("expiryDate");

-- CreateIndex
CREATE INDEX "stock_batches_status_idx" ON "stock_batches"("status");

-- CreateIndex
CREATE INDEX "stock_batches_damaged_idx" ON "stock_batches"("damaged");

-- CreateIndex
CREATE INDEX "stock_batches_obsolete_idx" ON "stock_batches"("obsolete");

-- CreateIndex
CREATE UNIQUE INDEX "stock_batches_batchNumber_itemId_locationId_key" ON "stock_batches"("batchNumber", "itemId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "disposal_requests_requestNumber_key" ON "disposal_requests"("requestNumber");

-- CreateIndex
CREATE INDEX "disposal_requests_itemId_idx" ON "disposal_requests"("itemId");

-- CreateIndex
CREATE INDEX "disposal_requests_locationId_idx" ON "disposal_requests"("locationId");

-- CreateIndex
CREATE INDEX "disposal_requests_status_idx" ON "disposal_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "disposal_approvals_disposalRequestId_key" ON "disposal_approvals"("disposalRequestId");

-- CreateIndex
CREATE INDEX "disposal_approvals_approvedById_idx" ON "disposal_approvals"("approvedById");

-- CreateIndex
CREATE UNIQUE INDEX "disposal_records_disposalRequestId_key" ON "disposal_records"("disposalRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "disposal_records_disposalNumber_key" ON "disposal_records"("disposalNumber");

-- CreateIndex
CREATE INDEX "disposal_records_disposedById_idx" ON "disposal_records"("disposedById");

-- CreateIndex
CREATE INDEX "disposal_records_disposedAt_idx" ON "disposal_records"("disposedAt");

-- AddForeignKey
ALTER TABLE "stock_takings" ADD CONSTRAINT "stock_takings_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_takings" ADD CONSTRAINT "stock_takings_startedById_fkey" FOREIGN KEY ("startedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_stockTakingId_fkey" FOREIGN KEY ("stockTakingId") REFERENCES "stock_takings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_countedById_fkey" FOREIGN KEY ("countedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_discrepancies" ADD CONSTRAINT "stock_discrepancies_stockTakingId_fkey" FOREIGN KEY ("stockTakingId") REFERENCES "stock_takings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_discrepancies" ADD CONSTRAINT "stock_discrepancies_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_discrepancies" ADD CONSTRAINT "stock_discrepancies_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_discrepancies" ADD CONSTRAINT "stock_discrepancies_investigatedById_fkey" FOREIGN KEY ("investigatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_discrepancyId_fkey" FOREIGN KEY ("discrepancyId") REFERENCES "stock_discrepancies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_requests" ADD CONSTRAINT "disposal_requests_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_requests" ADD CONSTRAINT "disposal_requests_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_requests" ADD CONSTRAINT "disposal_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_requests" ADD CONSTRAINT "disposal_requests_inspectedById_fkey" FOREIGN KEY ("inspectedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_requests" ADD CONSTRAINT "disposal_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_approvals" ADD CONSTRAINT "disposal_approvals_disposalRequestId_fkey" FOREIGN KEY ("disposalRequestId") REFERENCES "disposal_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_approvals" ADD CONSTRAINT "disposal_approvals_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_records" ADD CONSTRAINT "disposal_records_disposalRequestId_fkey" FOREIGN KEY ("disposalRequestId") REFERENCES "disposal_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposal_records" ADD CONSTRAINT "disposal_records_disposedById_fkey" FOREIGN KEY ("disposedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
