const reports = require("../services/reports.service");
const prisma = require("../lib/prisma");

async function inventory(req, res, next) {
  try {
    const data =
      await reports.inventoryReport(
        req.query
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function movements(req, res, next) {
  try {
    const data =
      await reports.stockMovementReport(
        req.query
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function receiving(req, res, next) {
  try {
    const data =
      await reports.receivingReport(
        req.query
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function issues(req, res, next) {
  try {
    const data =
      await reports.issueReport(
        req.query
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function procurement(req, res, next) {
  try {
    const data =
      await reports.procurementReport(
        req.query
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function stockTaking(req, res, next) {
  try {
    const data =
      await reports.stockTakingReport(
        req.query
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function disposal(req, res, next) {
  try {
    const data =
      await reports.disposalReport(
        req.query
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function financial(req, res, next) {
  try {
    const data =
      await reports.financialReport(
        req.query
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function options(req, res, next) {
  try {
    const [items, stores, categories, departments, suppliers, users] = await Promise.all([
      prisma.item.findMany({ select: { id: true, name: true, code: true } }),
      prisma.store.findMany({ select: { id: true, name: true } }),
      prisma.category.findMany({ select: { id: true, name: true } }),
      prisma.department.findMany({ select: { id: true, name: true } }),
      prisma.supplier.findMany({ select: { id: true, name: true } }),
      prisma.user.findMany({ select: { id: true, username: true, fullName: true } })
    ]);
    res.json({ success: true, data: { items, stores, categories, departments, suppliers, users } });
  } catch (error) {
    next(error);
  }
}

async function suppliers(req, res, next) {
  try {
    const data = await reports.supplierReport(req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function audit(req, res, next) {
  try {
    const data = await reports.auditReport(req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  inventory,
  movements,
  receiving,
  issues,
  procurement,
  stockTaking,
  disposal,
  financial,
  options,
  suppliers,
  audit
};