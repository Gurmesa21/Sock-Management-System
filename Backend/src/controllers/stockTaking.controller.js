const prisma = require("../lib/prisma");
const stockTakingService = require("../services/stockTaking.service");
const asyncHandler = require("../utils/asyncHandler");

const includeDetails = {
  store: true,
  startedBy: { select: { fullName: true } },
  counts: true,
  discrepancies: true,
};

const list = asyncHandler(async (req, res) => {
  const stockTakings = await prisma.stockTaking.findMany({
    include: includeDetails,
    orderBy: { startedAt: "desc" },
  });

  return res.json({
    success: true,
    data: { stockTakings },
  });
});

const create = asyncHandler(async (req, res) => {
  const stockTaking = await stockTakingService.createSession({
    ...req.body,
    userId: req.auth.user.id,
  });

  return res.status(201).json({
    success: true,
    data: { stockTaking },
  });
});

const getById = asyncHandler(async (req, res) => {
  const stockTaking = await prisma.stockTaking.findUnique({
    where: { id: req.params.id },
    include: includeDetails,
  });

  return res.json({
    success: true,
    data: { stockTaking },
  });
});

const addCount = asyncHandler(async (req, res) => {
  const count = await stockTakingService.addCount({
    ...req.body,
    stockTakingId: req.params.id,
    userId: req.auth.user.id,
  });

  return res.status(201).json({
    success: true,
    data: { count },
  });
});

const compare = asyncHandler(async (req, res) => {
  const discrepancies = await stockTakingService.compareSession(req.params.id);

  return res.json({
    success: true,
    data: { discrepancies },
  });
});

const investigate = asyncHandler(async (req, res) => {
  const discrepancy = await stockTakingService.investigateDiscrepancy(req.params.id, {
    reason: req.body.reason,
    investigation: req.body.investigation,
    userId: req.auth.user.id,
  });

  return res.json({
    success: true,
    data: { discrepancy },
  });
});

module.exports = {
  list,
  create,
  getById,
  addCount,
  compare,
  investigate,
};
