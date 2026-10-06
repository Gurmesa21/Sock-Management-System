-- CreateEnum
CREATE TYPE "StoreRequisitionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PICKING', 'ISSUED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StoreIssueStatus" AS ENUM ('PICKING', 'ISSUED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IssueVoucherType" AS ENUM ('SIV', 'ISIV');

-- CreateEnum
CREATE TYPE "MaterialReturnStatus" AS ENUM ('RETURN_REQUEST', 'RECEIVED', 'INSPECTED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GatePassStatus" AS ENUM ('CREATED', 'SECURITY_VERIFIED', 'EXIT_CONFIRMED', 'DISPATCH_RECORDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "store_requisitions" (
    "id" UUID NOT NULL,
    "requisitionNo" VARCHAR(50) NOT NULL,
    "requesterId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "purpose" VARCHAR(500) NOT NULL,
    "requiredDate" TIMESTAMP(3),
    "remarks" VARCHAR(500),
    "status" "StoreRequisitionStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_requisitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_requisition_items" (
    "id" UUID NOT NULL,
    "requisitionId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID,
    "requestedQty" DECIMAL(14,3) NOT NULL,
    "approvedQty" DECIMAL(14,3),
    "issuedQty" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "remarks" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_requisition_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisition_approvals" (
    "id" UUID NOT NULL,
    "requisitionId" UUID NOT NULL,
    "approverId" UUID NOT NULL,
    "decision" "ApprovalDecision" NOT NULL,
    "comments" VARCHAR(500),
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requisition_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_issues" (
    "id" UUID NOT NULL,
    "issueNo" VARCHAR(50) NOT NULL,
    "requisitionId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "issuedById" UUID NOT NULL,
    "status" "StoreIssueStatus" NOT NULL DEFAULT 'PICKING',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_issue_items" (
    "id" UUID NOT NULL,
    "storeIssueId" UUID NOT NULL,
    "requisitionItemId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "requestedQty" DECIMAL(14,3) NOT NULL,
    "approvedQty" DECIMAL(14,3) NOT NULL,
    "issuedQty" DECIMAL(14,3) NOT NULL,
    "remarks" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_issue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_vouchers" (
    "id" UUID NOT NULL,
    "voucherNo" VARCHAR(50) NOT NULL,
    "type" "IssueVoucherType" NOT NULL,
    "storeIssueId" UUID NOT NULL,
    "issuedToUserId" UUID,
    "departmentId" UUID NOT NULL,
    "voucherDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issue_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_returns" (
    "id" UUID NOT NULL,
    "returnNumber" VARCHAR(50) NOT NULL,
    "storeIssueId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "storeId" UUID NOT NULL,
    "status" "MaterialReturnStatus" NOT NULL DEFAULT 'RETURN_REQUEST',
    "reason" VARCHAR(500),
    "remarks" VARCHAR(1000),
    "receivedAt" TIMESTAMP(3),
    "inspectedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "inspectedById" UUID,
    "approvedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_return_items" (
    "id" UUID NOT NULL,
    "returnId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "locationId" UUID,
    "issuedQuantity" INTEGER NOT NULL,
    "returnedQuantity" INTEGER NOT NULL,
    "acceptedQuantity" INTEGER NOT NULL DEFAULT 0,
    "rejectedQuantity" INTEGER NOT NULL DEFAULT 0,
    "condition" VARCHAR(50),
    "remarks" VARCHAR(500),

    CONSTRAINT "material_return_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" UUID NOT NULL,
    "assetNumber" VARCHAR(50) NOT NULL,
    "itemId" UUID NOT NULL,
    "serialNumber" VARCHAR(100),
    "classification" VARCHAR(30) NOT NULL,
    "description" VARCHAR(1000),
    "acquisitionDate" TIMESTAMP(3),
    "acquisitionValue" DECIMAL(14,2),
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "currentLocationId" UUID,
    "assignedUserId" UUID,
    "assignedDepartmentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_assignments" (
    "id" UUID NOT NULL,
    "assetId" UUID NOT NULL,
    "userId" UUID,
    "departmentId" UUID,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),
    "remarks" VARCHAR(500),

    CONSTRAINT "asset_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_material_cards" (
    "id" UUID NOT NULL,
    "cardNumber" VARCHAR(50) NOT NULL,
    "userId" UUID NOT NULL,
    "departmentId" UUID,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "remarks" VARCHAR(500),

    CONSTRAINT "user_material_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gate_passes" (
    "id" UUID NOT NULL,
    "gatePassNumber" VARCHAR(50) NOT NULL,
    "issueVoucherId" UUID NOT NULL,
    "issuedToUserId" UUID NOT NULL,
    "departmentId" UUID,
    "destination" VARCHAR(255),
    "purpose" VARCHAR(500),
    "status" "GatePassStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "exitConfirmedAt" TIMESTAMP(3),
    "dispatchedAt" TIMESTAMP(3),
    "securityOfficerId" UUID,
    "vehicleNumber" VARCHAR(50),
    "driverName" VARCHAR(150),
    "remarks" VARCHAR(1000),

    CONSTRAINT "gate_passes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gate_pass_items" (
    "id" UUID NOT NULL,
    "gatePassId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" VARCHAR(500),

    CONSTRAINT "gate_pass_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatch_records" (
    "id" UUID NOT NULL,
    "gatePassId" UUID NOT NULL,
    "dispatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "securityOfficerId" UUID,
    "destination" VARCHAR(255),
    "vehicleNumber" VARCHAR(50),
    "driverName" VARCHAR(150),
    "remarks" VARCHAR(1000),

    CONSTRAINT "dispatch_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_requisitions_requisitionNo_key" ON "store_requisitions"("requisitionNo");

-- CreateIndex
CREATE INDEX "store_requisitions_requesterId_idx" ON "store_requisitions"("requesterId");

-- CreateIndex
CREATE INDEX "store_requisitions_departmentId_idx" ON "store_requisitions"("departmentId");

-- CreateIndex
CREATE INDEX "store_requisitions_storeId_idx" ON "store_requisitions"("storeId");

-- CreateIndex
CREATE INDEX "store_requisitions_status_idx" ON "store_requisitions"("status");

-- CreateIndex
CREATE INDEX "store_requisitions_createdAt_idx" ON "store_requisitions"("createdAt");

-- CreateIndex
CREATE INDEX "store_requisition_items_requisitionId_idx" ON "store_requisition_items"("requisitionId");

-- CreateIndex
CREATE INDEX "store_requisition_items_itemId_idx" ON "store_requisition_items"("itemId");

-- CreateIndex
CREATE INDEX "store_requisition_items_locationId_idx" ON "store_requisition_items"("locationId");

-- CreateIndex
CREATE INDEX "requisition_approvals_requisitionId_idx" ON "requisition_approvals"("requisitionId");

-- CreateIndex
CREATE INDEX "requisition_approvals_approverId_idx" ON "requisition_approvals"("approverId");

-- CreateIndex
CREATE UNIQUE INDEX "store_issues_issueNo_key" ON "store_issues"("issueNo");

-- CreateIndex
CREATE INDEX "store_issues_requisitionId_idx" ON "store_issues"("requisitionId");

-- CreateIndex
CREATE INDEX "store_issues_storeId_idx" ON "store_issues"("storeId");

-- CreateIndex
CREATE INDEX "store_issues_issuedById_idx" ON "store_issues"("issuedById");

-- CreateIndex
CREATE INDEX "store_issues_status_idx" ON "store_issues"("status");

-- CreateIndex
CREATE INDEX "store_issue_items_storeIssueId_idx" ON "store_issue_items"("storeIssueId");

-- CreateIndex
CREATE INDEX "store_issue_items_requisitionItemId_idx" ON "store_issue_items"("requisitionItemId");

-- CreateIndex
CREATE INDEX "store_issue_items_itemId_idx" ON "store_issue_items"("itemId");

-- CreateIndex
CREATE INDEX "store_issue_items_locationId_idx" ON "store_issue_items"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "issue_vouchers_voucherNo_key" ON "issue_vouchers"("voucherNo");

-- CreateIndex
CREATE INDEX "issue_vouchers_storeIssueId_idx" ON "issue_vouchers"("storeIssueId");

-- CreateIndex
CREATE INDEX "issue_vouchers_departmentId_idx" ON "issue_vouchers"("departmentId");

-- CreateIndex
CREATE INDEX "issue_vouchers_issuedToUserId_idx" ON "issue_vouchers"("issuedToUserId");

-- CreateIndex
CREATE INDEX "issue_vouchers_type_idx" ON "issue_vouchers"("type");

-- CreateIndex
CREATE UNIQUE INDEX "material_returns_returnNumber_key" ON "material_returns"("returnNumber");

-- CreateIndex
CREATE INDEX "material_returns_storeIssueId_idx" ON "material_returns"("storeIssueId");

-- CreateIndex
CREATE INDEX "material_returns_requesterId_idx" ON "material_returns"("requesterId");

-- CreateIndex
CREATE INDEX "material_returns_departmentId_idx" ON "material_returns"("departmentId");

-- CreateIndex
CREATE INDEX "material_returns_storeId_idx" ON "material_returns"("storeId");

-- CreateIndex
CREATE INDEX "material_returns_status_idx" ON "material_returns"("status");

-- CreateIndex
CREATE INDEX "material_return_items_returnId_idx" ON "material_return_items"("returnId");

-- CreateIndex
CREATE INDEX "material_return_items_itemId_idx" ON "material_return_items"("itemId");

-- CreateIndex
CREATE INDEX "material_return_items_locationId_idx" ON "material_return_items"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "assets_assetNumber_key" ON "assets"("assetNumber");

-- CreateIndex
CREATE UNIQUE INDEX "assets_serialNumber_key" ON "assets"("serialNumber");

-- CreateIndex
CREATE INDEX "assets_itemId_idx" ON "assets"("itemId");

-- CreateIndex
CREATE INDEX "assets_assignedUserId_idx" ON "assets"("assignedUserId");

-- CreateIndex
CREATE INDEX "assets_assignedDepartmentId_idx" ON "assets"("assignedDepartmentId");

-- CreateIndex
CREATE INDEX "assets_currentLocationId_idx" ON "assets"("currentLocationId");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- CreateIndex
CREATE INDEX "asset_assignments_assetId_idx" ON "asset_assignments"("assetId");

-- CreateIndex
CREATE INDEX "asset_assignments_userId_idx" ON "asset_assignments"("userId");

-- CreateIndex
CREATE INDEX "asset_assignments_departmentId_idx" ON "asset_assignments"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "user_material_cards_cardNumber_key" ON "user_material_cards"("cardNumber");

-- CreateIndex
CREATE INDEX "user_material_cards_userId_idx" ON "user_material_cards"("userId");

-- CreateIndex
CREATE INDEX "user_material_cards_departmentId_idx" ON "user_material_cards"("departmentId");

-- CreateIndex
CREATE INDEX "user_material_cards_status_idx" ON "user_material_cards"("status");

-- CreateIndex
CREATE UNIQUE INDEX "gate_passes_gatePassNumber_key" ON "gate_passes"("gatePassNumber");

-- CreateIndex
CREATE INDEX "gate_passes_issueVoucherId_idx" ON "gate_passes"("issueVoucherId");

-- CreateIndex
CREATE INDEX "gate_passes_issuedToUserId_idx" ON "gate_passes"("issuedToUserId");

-- CreateIndex
CREATE INDEX "gate_passes_status_idx" ON "gate_passes"("status");

-- CreateIndex
CREATE INDEX "gate_passes_securityOfficerId_idx" ON "gate_passes"("securityOfficerId");

-- CreateIndex
CREATE INDEX "gate_pass_items_gatePassId_idx" ON "gate_pass_items"("gatePassId");

-- CreateIndex
CREATE INDEX "gate_pass_items_itemId_idx" ON "gate_pass_items"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "dispatch_records_gatePassId_key" ON "dispatch_records"("gatePassId");

-- CreateIndex
CREATE INDEX "dispatch_records_securityOfficerId_idx" ON "dispatch_records"("securityOfficerId");

-- CreateIndex
CREATE INDEX "dispatch_records_dispatchedAt_idx" ON "dispatch_records"("dispatchedAt");

-- AddForeignKey
ALTER TABLE "store_requisitions" ADD CONSTRAINT "store_requisitions_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_requisitions" ADD CONSTRAINT "store_requisitions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_requisitions" ADD CONSTRAINT "store_requisitions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_requisition_items" ADD CONSTRAINT "store_requisition_items_requisitionId_fkey" FOREIGN KEY ("requisitionId") REFERENCES "store_requisitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_requisition_items" ADD CONSTRAINT "store_requisition_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_requisition_items" ADD CONSTRAINT "store_requisition_items_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisition_approvals" ADD CONSTRAINT "requisition_approvals_requisitionId_fkey" FOREIGN KEY ("requisitionId") REFERENCES "store_requisitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisition_approvals" ADD CONSTRAINT "requisition_approvals_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_issues" ADD CONSTRAINT "store_issues_requisitionId_fkey" FOREIGN KEY ("requisitionId") REFERENCES "store_requisitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_issues" ADD CONSTRAINT "store_issues_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_issues" ADD CONSTRAINT "store_issues_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_issue_items" ADD CONSTRAINT "store_issue_items_storeIssueId_fkey" FOREIGN KEY ("storeIssueId") REFERENCES "store_issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_issue_items" ADD CONSTRAINT "store_issue_items_requisitionItemId_fkey" FOREIGN KEY ("requisitionItemId") REFERENCES "store_requisition_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_issue_items" ADD CONSTRAINT "store_issue_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_issue_items" ADD CONSTRAINT "store_issue_items_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_vouchers" ADD CONSTRAINT "issue_vouchers_storeIssueId_fkey" FOREIGN KEY ("storeIssueId") REFERENCES "store_issues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_vouchers" ADD CONSTRAINT "issue_vouchers_issuedToUserId_fkey" FOREIGN KEY ("issuedToUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_vouchers" ADD CONSTRAINT "issue_vouchers_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_returns" ADD CONSTRAINT "material_returns_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_returns" ADD CONSTRAINT "material_returns_inspectedById_fkey" FOREIGN KEY ("inspectedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_returns" ADD CONSTRAINT "material_returns_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_return_items" ADD CONSTRAINT "material_return_items_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "material_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_return_items" ADD CONSTRAINT "material_return_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_return_items" ADD CONSTRAINT "material_return_items_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_currentLocationId_fkey" FOREIGN KEY ("currentLocationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_assignedDepartmentId_fkey" FOREIGN KEY ("assignedDepartmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_assignments" ADD CONSTRAINT "asset_assignments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_material_cards" ADD CONSTRAINT "user_material_cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_material_cards" ADD CONSTRAINT "user_material_cards_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_passes" ADD CONSTRAINT "gate_passes_issuedToUserId_fkey" FOREIGN KEY ("issuedToUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_passes" ADD CONSTRAINT "gate_passes_securityOfficerId_fkey" FOREIGN KEY ("securityOfficerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_pass_items" ADD CONSTRAINT "gate_pass_items_gatePassId_fkey" FOREIGN KEY ("gatePassId") REFERENCES "gate_passes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gate_pass_items" ADD CONSTRAINT "gate_pass_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_records" ADD CONSTRAINT "dispatch_records_gatePassId_fkey" FOREIGN KEY ("gatePassId") REFERENCES "gate_passes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_records" ADD CONSTRAINT "dispatch_records_securityOfficerId_fkey" FOREIGN KEY ("securityOfficerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
