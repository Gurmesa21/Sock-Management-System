const prisma = require("../lib/prisma");
const shelfLifeService = require("../services/shelfLife.service");
const asyncHandler = require("../utils/asyncHandler");

const list = asyncHandler(async (req, res) => {
  const batches = await prisma.stockBatch.findMany({
    where: {
      ...(req.query.itemId ? { itemId: req.query.itemId } : {}),
      ...(req.query.locationId ? { locationId: req.query.locationId } : {}),
      status: req.query.status || "ACTIVE",
    },
    include: { item: true, location: true },
    orderBy: { expiryDate: "asc" },
  });

  return res.json({ success: true, data: { batches } });
});

const expiring = asyncHandler(async (req, res) => {
  const batches = await shelfLifeService.getExpiringStock(req.query);
  return res.json({ success: true, data: { batches } });
});

const expired = asyncHandler(async (req, res) => {
  const batches = await shelfLifeService.getExpiredStock(req.query);
  return res.json({ success: true, data: { batches } });
});

const getById = asyncHandler(async (req, res) => {
  const batch = await prisma.stockBatch.findUnique({
    where: { id: req.params.id },
    include: { item: true, location: true },
  });

  if (!batch) {
    return res.status(404).json({ success: false, error: "Batch not found" });
  }

  return res.json({ success: true, data: { batch } });
});

const create = asyncHandler(async (req, res) => {
  const batch = await shelfLifeService.createBatch(req.body);
  return res.status(201).json({ success: true, data: { batch } });
});

module.exports = {
  list,
  expiring,
  expired,
  getById,
  create,
};
