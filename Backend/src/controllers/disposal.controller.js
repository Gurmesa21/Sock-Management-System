const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const disposalService = require("../services/disposal.service");
const { createNotificationsForUsers, getUsersByPermission } = require("../services/notification.service");

const includeDetails = {
  item: true,
  location: {
    include: {
      store: true
    }
  },
  approval: {
    include: {
      approvedBy: {
        select: { id: true, fullName: true, username: true }
      }
    }
  },
  record: {
    include: {
      disposedBy: {
        select: { id: true, fullName: true, username: true }
      }
    }
  },
  requestedBy: {
    select: { id: true, fullName: true, username: true }
  },
  inspectedBy: {
    select: { id: true, fullName: true, username: true }
  },
  approvedBy: {
    select: { id: true, fullName: true, username: true }
  }
};

const list = asyncHandler(async (req, res) => {
  const requests = await prisma.disposalRequest.findMany({
    include: includeDetails,
    orderBy: { requestedAt: "desc" },
  });

  return res.json({ success: true, data: { requests } });
});

const create = asyncHandler(async (req, res) => {
  // Validate inventory first
  const balance = await prisma.inventoryBalance.findUnique({
    where: {
      itemId_locationId: {
        itemId: req.body.itemId,
        locationId: req.body.locationId
      }
    }
  });

  if (!balance || balance.quantity.lt(req.body.quantity)) {
    return res.status(400).json({ 
      success: false, 
      message: "Insufficient inventory for disposal at the selected location." 
    });
  }

  const request = await prisma.disposalRequest.create({
    data: {
      requestNumber: `DSP-${Date.now()}`,
      itemId: req.body.itemId,
      locationId: req.body.locationId,
      quantity: req.body.quantity,
      reason: req.body.reason,
      requestedById: req.auth.user.id,
    },
    include: includeDetails,
  });

  const notifyUserIds = await getUsersByPermission("approve_disposal");
  await createNotificationsForUsers({
    userIds: notifyUserIds,
    type: "DISPOSAL_APPROVAL",
    title: "Disposal Pending Approval",
    message: `Disposal Request ${request.requestNumber} is pending review.`,
    entityType: "DISPOSAL_REQUEST",
    entityId: request.id,
  });

  return res.status(201).json({ success: true, data: { request } });
});

const getById = asyncHandler(async (req, res) => {
  const request = await prisma.disposalRequest.findUnique({
    where: { id: req.params.id },
    include: includeDetails,
  });

  return res.json({ success: true, data: { request } });
});

const inspect = asyncHandler(async (req, res) => {
  const existing = await prisma.disposalRequest.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ success: false, message: "Disposal request not found" });
  if (existing.status !== "REQUESTED") return res.status(400).json({ success: false, message: "Disposal request must be in REQUESTED status to be inspected" });
  if (existing.requestedById === req.auth.user.id) {
    return res.status(403).json({ success: false, message: "You cannot inspect your own disposal request" });
  }

  const nextStatus = req.body.approvedForDisposal ? "INSPECTED" : "REJECTED";

  const request = await prisma.disposalRequest.update({
    where: { id: req.params.id },
    data: {
      status: nextStatus,
      inspectionResult: req.body.result,
      inspectedById: req.auth.user.id,
      inspectedAt: new Date(),
    },
    include: includeDetails,
  });

  return res.json({ success: true, data: { request } });
});

const approve = asyncHandler(async (req, res) => {
  const existing = await prisma.disposalRequest.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ success: false, message: "Disposal request not found" });
  if (existing.status !== "INSPECTED") return res.status(400).json({ success: false, message: "Disposal request must be in INSPECTED status to be approved" });
  if (existing.requestedById === req.auth.user.id) {
    return res.status(403).json({ success: false, message: "You cannot approve your own disposal request" });
  }

  const request = await prisma.$transaction(async (tx) => {
    const updated = await tx.disposalRequest.update({
      where: { id: req.params.id },
      data: {
        status: "APPROVED",
        approvedById: req.auth.user.id,
        approvedAt: new Date(),
      }
    });

    await tx.disposalApproval.create({
      data: {
        disposalRequestId: req.params.id,
        approved: true,
        approvedById: req.auth.user.id,
        remarks: req.body.remarks || null,
      }
    });

    return tx.disposalRequest.findUnique({
      where: { id: req.params.id },
      include: includeDetails,
    });
  });

  return res.json({ success: true, data: { request } });
});

const reject = asyncHandler(async (req, res) => {
  const existing = await prisma.disposalRequest.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ success: false, message: "Disposal request not found" });
  if (existing.status !== "INSPECTED") return res.status(400).json({ success: false, message: "Disposal request must be in INSPECTED status to be rejected" });
  if (existing.requestedById === req.auth.user.id) {
    return res.status(403).json({ success: false, message: "You cannot reject your own disposal request" });
  }

  if (!req.body.remarks) {
    return res.status(400).json({ success: false, message: "Remarks are required for rejection" });
  }

  const request = await prisma.$transaction(async (tx) => {
    const updated = await tx.disposalRequest.update({
      where: { id: req.params.id },
      data: {
        status: "REJECTED",
        approvedById: req.auth.user.id, // we store who performed the final decision
        approvedAt: new Date(),
      }
    });

    await tx.disposalApproval.create({
      data: {
        disposalRequestId: req.params.id,
        approved: false,
        approvedById: req.auth.user.id,
        remarks: req.body.remarks,
      }
    });

    return tx.disposalRequest.findUnique({
      where: { id: req.params.id },
      include: includeDetails,
    });
  });

  return res.json({ success: true, data: { request } });
});

const complete = asyncHandler(async (req, res) => {
  const result = await disposalService.completeDisposal(
    req.params.id,
    req.auth.user.id,
    req.body.disposalMethod,
    req.body.remarks
  );

  const request = await prisma.disposalRequest.findUnique({
    where: { id: req.params.id },
    include: includeDetails,
  });

  return res.json({ success: true, data: { request } });
});

module.exports = {
  list,
  create,
  getById,
  inspect,
  approve,
  reject,
  complete,
};
