-- DropIndex
DROP INDEX "inspections_goodsReceiptId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "inspections_goodsReceiptId_key" ON "inspections"("goodsReceiptId");
