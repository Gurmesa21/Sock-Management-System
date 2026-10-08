const stockTransferService = require("../services/stockTransfer.service");

async function createTransfer(req, res) {
  const transfer = await stockTransferService.createTransfer({
    ...req.body,
    userId: req.auth.user.id,
  });

  return res.status(201).json({ success: true, data: { transfer } });
}

async function listTransfers(req, res) {
  const result = await stockTransferService.listTransfers(req.query || {});
  return res.json({ success: true, data: result.data, pagination: result.pagination });
}

async function getTransferById(req, res) {
  const transfer = await stockTransferService.getTransferById(req.params.id);
  return res.json({ success: true, data: transfer });
}

async function submitTransfer(req, res) {
  const transfer = await stockTransferService.submitTransfer({ transferId: req.params.id, userId: req.auth.user.id });
  return res.json({ success: true, data: transfer });
}

async function approveTransfer(req, res) {
  const transfer = await stockTransferService.approveTransfer({ transferId: req.params.id, userId: req.auth.user.id });
  return res.json({ success: true, data: transfer });
}

async function completeTransfer(req, res) {
  const transfer = await stockTransferService.completeTransfer({ transferId: req.params.id, userId: req.auth.user.id });
  return res.json({ success: true, data: transfer });
}

module.exports = {
  createTransfer,
  listTransfers,
  getTransferById,
  submitTransfer,
  approveTransfer,
  completeTransfer,
};