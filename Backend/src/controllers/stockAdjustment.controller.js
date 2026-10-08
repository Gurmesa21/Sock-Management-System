const prisma = require("../lib/prisma");
const asyncHandler = require("../utils/asyncHandler");
const inventoryTransactionService = require("../services/inventoryTransaction.service");
const fifoService = require("../services/fifo.service");

const includeDetails = {
  item: true,
  location: true,
  discrepancy: true,
  requestedBy: { select: { id: true, username: true, fullName: true } },
  approvedBy: { select: { id: true, username: true, fullName: true } },
};

const list = asyncHandler(async (req, res) => {
  const adjustments = await prisma.stockAdjustment.findMany({
    include: includeDetails,
    orderBy: { requestedAt: "desc" },
  });

  return res.json({
    success: true,
    data: { adjustments },
  });
});

const create = asyncHandler(async (req, res) => {
  if (req.body.discrepancyId) {
    const discrepancy = await prisma.stockDiscrepancy.findUnique({
      where: { id: req.body.discrepancyId }
    });
    if (!discrepancy) {
      throw Object.assign(new Error("Discrepancy not found."), { statusCode: 404 });
    }
    if (discrepancy.itemId !== req.body.itemId) {
      throw Object.assign(new Error("Item mismatch with discrepancy."), { statusCode: 400 });
    }
    if (discrepancy.locationId !== req.body.locationId) {
      throw Object.assign(new Error("Location mismatch with discrepancy."), { statusCode: 400 });
    }
    if (discrepancy.status !== "INVESTIGATED") {
      throw Object.assign(new Error("Discrepancy must be investigated before adjustment."), { statusCode: 400 });
    }
  }

  const adjustment = await prisma.stockAdjustment.create({
    data: {
      adjustmentNumber: `ADJ-${Date.now()}`,
      discrepancyId: req.body.discrepancyId || null,
      itemId: req.body.itemId,
      locationId: req.body.locationId,
      quantity: req.body.quantity,
      direction: req.body.direction,
      reason: req.body.reason,
      requestedById: req.auth.user.id,
    },
  });

  return res.status(201).json({
    success: true,
    data: { adjustment },
  });
});

const getById = asyncHandler(async (req, res) => {
  const adjustment = await prisma.stockAdjustment.findUnique({
    where: { id: req.params.id },
    include: includeDetails,
  });

  return res.json({
    success: true,
    data: { adjustment },
  });
});

const approve = asyncHandler(async (req, res) => {
  const adjustment = await prisma.stockAdjustment.findUnique({
    where: { id: req.params.id },
    include: includeDetails,
  });

  if (!adjustment) {
    throw Object.assign(new Error("Adjustment not found."), { statusCode: 404 });
  }

  if (adjustment.status !== "PENDING_APPROVAL") {
    throw Object.assign(new Error("Adjustment must be pending approval."), { statusCode: 409 });
  }

  if (adjustment.requestedById === req.auth.user.id) {
    throw Object.assign(new Error("You cannot approve your own stock adjustment."), { statusCode: 403 });
  }

  const signedQuantity =
    String(adjustment.direction).toUpperCase() === "DECREASE"
      ? -Math.abs(Number(adjustment.quantity))
      : Math.abs(Number(adjustment.quantity));

  const updated = await prisma.$transaction(async (tx) => {
    const updateCount = await tx.stockAdjustment.updateMany({
      where: { id: adjustment.id, status: "PENDING_APPROVAL" },
      data: {
        status: "APPROVED",
        approvedById: req.auth.user.id,
        approvedAt: new Date(),
      }
    });

    if (updateCount.count === 0) {
      throw Object.assign(new Error("Adjustment already approved or rejected concurrently."), { statusCode: 409 });
    }

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

    await inventoryTransactionService.applyTransaction(tx, {
      type: "ADJUSTMENT",
      itemId: adjustment.itemId,
      locationId: adjustment.locationId,
      quantity: signedQuantity,
      userId: req.auth.user.id,
      referenceType: "STOCK_ADJUSTMENT",
      referenceId: adjustment.id,
      reason: adjustment.reason || "Stock adjustment approval",
      allowNegative: false,
      unitCost,
    });

    return tx.stockAdjustment.findUnique({
      where: { id: adjustment.id },
      include: includeDetails,
    });
  });

  return res.json({
    success: true,
    data: { adjustment: updated },
  });
});

const reject = asyncHandler(async (req, res) => {
  const current = await prisma.stockAdjustment.findUnique({
    where: { id: req.params.id },
  });

  if (!current) {
    throw Object.assign(new Error("Adjustment not found."), { statusCode: 404 });
  }

  if (current.status !== "PENDING_APPROVAL") {
    throw Object.assign(new Error("Adjustment must be pending approval to be rejected."), { statusCode: 409 });
  }

  if (current.requestedById === req.auth.user.id) {
    throw Object.assign(new Error("You cannot reject your own stock adjustment."), { statusCode: 403 });
  }

  const adjustment = await prisma.stockAdjustment.update({
    where: { id: req.params.id },
    data: {
      status: "REJECTED",
      rejectionReason: req.body.reason,
      rejectedAt: new Date(),
    },
  });

  return res.json({
    success: true,
    data: { adjustment },
  });
});

module.exports = {
  list,
  create,
  getById,
  approve,
  reject,
};
