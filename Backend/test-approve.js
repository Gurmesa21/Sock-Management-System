const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fifoService = require('./src/services/fifo.service');
const inventoryTransactionService = require('./src/services/inventoryTransaction.service');

async function testApprove() {
  const adjustment = await prisma.stockAdjustment.findUnique({
    where: { id: '2c8a6890-2153-4e0b-95ec-a25e7e29a097' },
  });

  const signedQuantity =
    String(adjustment.direction).toUpperCase() === "DECREASE"
      ? -Math.abs(Number(adjustment.quantity))
      : Math.abs(Number(adjustment.quantity));

  console.log("Signed Quantity:", signedQuantity);

  try {
    await prisma.$transaction(async (tx) => {
      let unitCost = null;
      if (signedQuantity > 0) {
        unitCost = await fifoService.getAverageCost({
          itemId: adjustment.itemId,
          locationId: adjustment.locationId
        });
      } else {
        unitCost = await fifoService.getAverageCost({
          itemId: adjustment.itemId,
          locationId: adjustment.locationId,
          quantityToConsume: Math.abs(signedQuantity)
        });
      }
      console.log("Unit Cost:", unitCost);

      await inventoryTransactionService.applyTransaction(tx, {
        type: "ADJUSTMENT",
        itemId: adjustment.itemId,
        locationId: adjustment.locationId,
        quantity: signedQuantity,
        userId: adjustment.requestedById,
        referenceType: "STOCK_ADJUSTMENT",
        referenceId: adjustment.id,
        reason: adjustment.reason || "Stock adjustment approval",
        allowNegative: false,
        unitCost,
      });
      console.log("Applied Transaction");
      
      // Rollback intentionally to not modify DB
      throw new Error("ROLLBACK_FOR_TEST");
    });
  } catch (err) {
    if (err.message !== "ROLLBACK_FOR_TEST") {
      console.error(err);
    } else {
      console.log("Test completed successfully (rolled back).");
    }
  }
}
testApprove().finally(() => process.exit(0));
