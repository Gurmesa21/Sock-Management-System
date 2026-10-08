const valuation = require("../services/valuation.service");
const prisma = require("../lib/prisma");

async function options(req, res, next) {
  try {
    const [items, locations] = await Promise.all([
      prisma.item.findMany({
        where: { status: "Active" },
        select: { id: true, code: true, name: true },
        orderBy: { name: "asc" }
      }),
      prisma.location.findMany({
        where: { status: "Active" },
        select: { id: true, code: true, section: true, bin: true },
        orderBy: { code: "asc" }
      })
    ]);
    res.json({ success: true, data: { items, locations } });
  } catch (error) {
    next(error);
  }
}

async function itemValuation(
  req,
  res,
  next
) {
  try {
    const data =
      await valuation.getItemValuation({
        itemId: req.params.itemId,
        locationId: req.params.locationId,
        asOfDate: req.query.asOfDate
          ? (() => {
              const parts = req.query.asOfDate.split('-');
              if (parts.length === 3) {
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                d.setHours(23, 59, 59, 999);
                return d;
              }
              const d = new Date(req.query.asOfDate);
              d.setHours(23, 59, 59, 999);
              return d;
            })()
          : undefined
      });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function totalValuation(
  req,
  res,
  next
) {
  try {
    const data =
      await valuation.getTotalValuation({
        storeId: req.query.storeId,
        categoryId:
          req.query.categoryId,
        asOfDate: req.query.asOfDate
          ? (() => {
              const parts = req.query.asOfDate.split('-');
              if (parts.length === 3) {
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                d.setHours(23, 59, 59, 999);
                return d;
              }
              const d = new Date(req.query.asOfDate);
              d.setHours(23, 59, 59, 999);
              return d;
            })()
          : undefined
      });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  itemValuation,
  totalValuation,
  options
};