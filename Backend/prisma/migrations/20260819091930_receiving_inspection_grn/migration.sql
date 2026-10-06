-- CreateEnum
CREATE TYPE "ProcurementStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('IN_TRANSIT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "purchase_requisitions" (
    "id" UUID NOT NULL,
    "requestNumber" VARCHAR(30) NOT NULL,
    "requesterId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "supplierId" UUID,
    "requiredDate" TIMESTAMP(3) NOT NULL,
    "purpose" VARCHAR(500) NOT NULL,
    "notes" VARCHAR(1000),
    "status" "ProcurementStatus" NOT NULL DEFAULT 'DRAFT',
    "rejectionReason" VARCHAR(500),
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "approvedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_requisitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_requisition_items" (
    "id" UUID NOT NULL,
    "requisitionId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "quantity" DECIMAL(14,2) NOT NULL,
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" UUID,

    CONSTRAINT "purchase_requisition_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL,
    "orderNumber" VARCHAR(30) NOT NULL,
    "requisitionId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDeliveryDate" TIMESTAMP(3),
    "status" "ProcurementStatus" NOT NULL DEFAULT 'ORDERED',
    "subtotal" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "notes" VARCHAR(1000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" UUID NOT NULL,
    "purchaseOrderId" UUID NOT NULL,
    "requisitionItemId" UUID,
    "itemId" UUID NOT NULL,
    "quantity" DECIMAL(14,2) NOT NULL,
    "unitPrice" DECIMAL(16,2) NOT NULL,
    "totalPrice" DECIMAL(16,2) NOT NULL,
    "deliveredQuantity" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" UUID,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" UUID NOT NULL,
    "deliveryNumber" VARCHAR(30) NOT NULL,
    "purchaseOrderId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "expectedDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "status" "DeliveryStatus" NOT NULL DEFAULT 'IN_TRANSIT',
    "notes" VARCHAR(1000),
    "goodsReceivingId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_items" (
    "id" UUID NOT NULL,
    "deliveryId" UUID NOT NULL,
    "purchaseOrderItemId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "quantity" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" UUID,

    CONSTRAINT "delivery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_receipts" (
    "id" UUID NOT NULL,
    "receiptNumber" VARCHAR(50) NOT NULL,
    "deliveryId" UUID,
    "purchaseOrderId" UUID,
    "supplierId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "sourceType" VARCHAR(30) NOT NULL DEFAULT 'PURCHASE_ORDER',
    "purchaseReference" VARCHAR(100),
    "receiptType" VARCHAR(50) NOT NULL DEFAULT 'Purchase Order',
    "documentReference" VARCHAR(150),
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(1000),
    "status" VARCHAR(40) NOT NULL DEFAULT 'VERIFICATION_PENDING',
    "receivedById" UUID NOT NULL,
    "verifiedById" UUID,
    "verifiedAt" TIMESTAMP(3),
    "evaluationDecision" VARCHAR(30),
    "evaluationRemarks" VARCHAR(1000),
    "inventoryPosted" BOOLEAN NOT NULL DEFAULT false,
    "inventoryPostedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goods_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_receipt_items" (
    "id" UUID NOT NULL,
    "goodsReceiptId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID,
    "quantityExpected" INTEGER NOT NULL DEFAULT 0,
    "quantityReceived" INTEGER NOT NULL,
    "acceptedQuantity" INTEGER NOT NULL DEFAULT 0,
    "rejectedQuantity" INTEGER NOT NULL DEFAULT 0,
    "unit" VARCHAR(50) NOT NULL,
    "condition" VARCHAR(100),
    "assetClassification" VARCHAR(30) NOT NULL DEFAULT 'NON_FIXED',
    "remarks" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goods_receipt_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspections" (
    "id" UUID NOT NULL,
    "goodsReceiptId" UUID NOT NULL,
    "inspectorId" UUID NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantityVerification" VARCHAR(50) NOT NULL DEFAULT 'Passed',
    "qualityVerification" VARCHAR(50) NOT NULL DEFAULT 'Passed',
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "decision" VARCHAR(30),
    "remarks" VARCHAR(1000),
    "approvedById" UUID,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_items" (
    "id" UUID NOT NULL,
    "inspectionId" UUID NOT NULL,
    "goodsReceiptItemId" UUID NOT NULL,
    "quantityReceived" INTEGER NOT NULL,
    "acceptedQuantity" INTEGER NOT NULL DEFAULT 0,
    "rejectedQuantity" INTEGER NOT NULL DEFAULT 0,
    "condition" VARCHAR(100),
    "result" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "remarks" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspection_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_evaluations" (
    "id" UUID NOT NULL,
    "inspectionId" UUID NOT NULL,
    "evaluatorId" UUID NOT NULL,
    "decision" VARCHAR(30) NOT NULL,
    "remarks" VARCHAR(1000),
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technical_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grns" (
    "id" UUID NOT NULL,
    "grnNumber" VARCHAR(50) NOT NULL,
    "goodsReceiptId" UUID NOT NULL,
    "supplierId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "purchaseReference" VARCHAR(100),
    "documentReference" VARCHAR(150),
    "grnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "evaluationDecision" VARCHAR(30) NOT NULL,
    "evaluationRemarks" VARCHAR(1000),
    "inventoryUpdated" BOOLEAN NOT NULL DEFAULT false,
    "inventoryPostedAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grn_items" (
    "id" UUID NOT NULL,
    "grnId" UUID NOT NULL,
    "goodsReceiptItemId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID,
    "quantityReceived" INTEGER NOT NULL,
    "acceptedQuantity" INTEGER NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "condition" VARCHAR(100),
    "assetClassification" VARCHAR(30) NOT NULL DEFAULT 'NON_FIXED',
    "remarks" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grn_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supporting_documents" (
    "id" UUID NOT NULL,
    "goodsReceiptId" UUID,
    "grnId" UUID,
    "documentType" VARCHAR(50) NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(100),
    "sizeBytes" INTEGER,
    "storageKey" VARCHAR(500),
    "documentNumber" VARCHAR(100),
    "description" VARCHAR(500),
    "uploadedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supporting_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_sequences" (
    "id" UUID NOT NULL,
    "documentKey" VARCHAR(50) NOT NULL,
    "year" INTEGER NOT NULL,
    "nextNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchase_requisitions_requestNumber_key" ON "purchase_requisitions"("requestNumber");

-- CreateIndex
CREATE INDEX "purchase_requisitions_requesterId_idx" ON "purchase_requisitions"("requesterId");

-- CreateIndex
CREATE INDEX "purchase_requisitions_departmentId_idx" ON "purchase_requisitions"("departmentId");

-- CreateIndex
CREATE INDEX "purchase_requisitions_storeId_idx" ON "purchase_requisitions"("storeId");

-- CreateIndex
CREATE INDEX "purchase_requisitions_supplierId_idx" ON "purchase_requisitions"("supplierId");

-- CreateIndex
CREATE INDEX "purchase_requisitions_status_idx" ON "purchase_requisitions"("status");

-- CreateIndex
CREATE INDEX "purchase_requisitions_requiredDate_idx" ON "purchase_requisitions"("requiredDate");

-- CreateIndex
CREATE INDEX "purchase_requisitions_createdAt_idx" ON "purchase_requisitions"("createdAt");

-- CreateIndex
CREATE INDEX "purchase_requisition_items_requisitionId_idx" ON "purchase_requisition_items"("requisitionId");

-- CreateIndex
CREATE INDEX "purchase_requisition_items_itemId_idx" ON "purchase_requisition_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_orderNumber_key" ON "purchase_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "purchase_orders_requisitionId_idx" ON "purchase_orders"("requisitionId");

-- CreateIndex
CREATE INDEX "purchase_orders_supplierId_idx" ON "purchase_orders"("supplierId");

-- CreateIndex
CREATE INDEX "purchase_orders_createdById_idx" ON "purchase_orders"("createdById");

-- CreateIndex
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "purchase_orders_orderDate_idx" ON "purchase_orders"("orderDate");

-- CreateIndex
CREATE INDEX "purchase_order_items_purchaseOrderId_idx" ON "purchase_order_items"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "purchase_order_items_requisitionItemId_idx" ON "purchase_order_items"("requisitionItemId");

-- CreateIndex
CREATE INDEX "purchase_order_items_itemId_idx" ON "purchase_order_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "deliveries_deliveryNumber_key" ON "deliveries"("deliveryNumber");

-- CreateIndex
CREATE INDEX "deliveries_purchaseOrderId_idx" ON "deliveries"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "deliveries_supplierId_idx" ON "deliveries"("supplierId");

-- CreateIndex
CREATE INDEX "deliveries_status_idx" ON "deliveries"("status");

-- CreateIndex
CREATE INDEX "deliveries_expectedDate_idx" ON "deliveries"("expectedDate");

-- CreateIndex
CREATE INDEX "deliveries_actualDate_idx" ON "deliveries"("actualDate");

-- CreateIndex
CREATE INDEX "delivery_items_deliveryId_idx" ON "delivery_items"("deliveryId");

-- CreateIndex
CREATE INDEX "delivery_items_purchaseOrderItemId_idx" ON "delivery_items"("purchaseOrderItemId");

-- CreateIndex
CREATE INDEX "delivery_items_itemId_idx" ON "delivery_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "goods_receipts_receiptNumber_key" ON "goods_receipts"("receiptNumber");

-- CreateIndex
CREATE INDEX "goods_receipts_deliveryId_idx" ON "goods_receipts"("deliveryId");

-- CreateIndex
CREATE INDEX "goods_receipts_purchaseOrderId_idx" ON "goods_receipts"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "goods_receipts_supplierId_idx" ON "goods_receipts"("supplierId");

-- CreateIndex
CREATE INDEX "goods_receipts_storeId_idx" ON "goods_receipts"("storeId");

-- CreateIndex
CREATE INDEX "goods_receipts_status_idx" ON "goods_receipts"("status");

-- CreateIndex
CREATE INDEX "goods_receipts_deliveryDate_idx" ON "goods_receipts"("deliveryDate");

-- CreateIndex
CREATE INDEX "goods_receipt_items_goodsReceiptId_idx" ON "goods_receipt_items"("goodsReceiptId");

-- CreateIndex
CREATE INDEX "goods_receipt_items_itemId_idx" ON "goods_receipt_items"("itemId");

-- CreateIndex
CREATE INDEX "goods_receipt_items_locationId_idx" ON "goods_receipt_items"("locationId");

-- CreateIndex
CREATE INDEX "inspections_goodsReceiptId_idx" ON "inspections"("goodsReceiptId");

-- CreateIndex
CREATE INDEX "inspections_inspectorId_idx" ON "inspections"("inspectorId");

-- CreateIndex
CREATE INDEX "inspections_status_idx" ON "inspections"("status");

-- CreateIndex
CREATE INDEX "inspection_items_goodsReceiptItemId_idx" ON "inspection_items"("goodsReceiptItemId");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_items_inspectionId_goodsReceiptItemId_key" ON "inspection_items"("inspectionId", "goodsReceiptItemId");

-- CreateIndex
CREATE UNIQUE INDEX "technical_evaluations_inspectionId_key" ON "technical_evaluations"("inspectionId");

-- CreateIndex
CREATE INDEX "technical_evaluations_evaluatorId_idx" ON "technical_evaluations"("evaluatorId");

-- CreateIndex
CREATE UNIQUE INDEX "grns_grnNumber_key" ON "grns"("grnNumber");

-- CreateIndex
CREATE INDEX "grns_supplierId_idx" ON "grns"("supplierId");

-- CreateIndex
CREATE INDEX "grns_storeId_idx" ON "grns"("storeId");

-- CreateIndex
CREATE INDEX "grns_grnDate_idx" ON "grns"("grnDate");

-- CreateIndex
CREATE INDEX "grns_status_idx" ON "grns"("status");

-- CreateIndex
CREATE UNIQUE INDEX "grns_goodsReceiptId_key" ON "grns"("goodsReceiptId");

-- CreateIndex
CREATE INDEX "grn_items_itemId_idx" ON "grn_items"("itemId");

-- CreateIndex
CREATE INDEX "grn_items_locationId_idx" ON "grn_items"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "grn_items_grnId_goodsReceiptItemId_key" ON "grn_items"("grnId", "goodsReceiptItemId");

-- CreateIndex
CREATE INDEX "supporting_documents_goodsReceiptId_idx" ON "supporting_documents"("goodsReceiptId");

-- CreateIndex
CREATE INDEX "supporting_documents_grnId_idx" ON "supporting_documents"("grnId");

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_documentKey_year_key" ON "document_sequences"("documentKey", "year");

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisition_items" ADD CONSTRAINT "purchase_requisition_items_requisitionId_fkey" FOREIGN KEY ("requisitionId") REFERENCES "purchase_requisitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisition_items" ADD CONSTRAINT "purchase_requisition_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_requisition_items" ADD CONSTRAINT "purchase_requisition_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_requisitionId_fkey" FOREIGN KEY ("requisitionId") REFERENCES "purchase_requisitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_requisitionItemId_fkey" FOREIGN KEY ("requisitionItemId") REFERENCES "purchase_requisition_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_items" ADD CONSTRAINT "delivery_items_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_items" ADD CONSTRAINT "delivery_items_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "purchase_order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_items" ADD CONSTRAINT "delivery_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_items" ADD CONSTRAINT "delivery_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliveries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "goods_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "goods_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_items" ADD CONSTRAINT "inspection_items_goodsReceiptItemId_fkey" FOREIGN KEY ("goodsReceiptItemId") REFERENCES "goods_receipt_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_evaluations" ADD CONSTRAINT "technical_evaluations_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_evaluations" ADD CONSTRAINT "technical_evaluations_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grns" ADD CONSTRAINT "grns_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "goods_receipts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grns" ADD CONSTRAINT "grns_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grns" ADD CONSTRAINT "grns_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grns" ADD CONSTRAINT "grns_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "grns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_goodsReceiptItemId_fkey" FOREIGN KEY ("goodsReceiptItemId") REFERENCES "goods_receipt_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grn_items" ADD CONSTRAINT "grn_items_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supporting_documents" ADD CONSTRAINT "supporting_documents_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "goods_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supporting_documents" ADD CONSTRAINT "supporting_documents_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "grns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supporting_documents" ADD CONSTRAINT "supporting_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
