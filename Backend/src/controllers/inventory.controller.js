const inventoryBalanceService =
  require("../services/inventoryBalance.service");

async function listInventory(req, res) {
  const {
    page = 1,
    limit = 20,
    search,
    itemId,
    locationId,
  } = req.query;

  const result =
    await inventoryBalanceService.listBalances({
      page: Number(page),
      limit: Number(limit),
      search,
      itemId,
      locationId,
    });

  return res.json({
    success: true,
    data: result.data,
    pagination: result.pagination,
    summary: result.summary,
  });
}

async function getInventoryBalance(req, res) {
  const {
    itemId,
    locationId,
  } = req.params;

  const result =
    await inventoryBalanceService.getBalance(
      itemId,
      locationId
    );

  return res.json({
    success: true,
    data: result,
  });
}

module.exports = {
  listInventory,
  getInventoryBalance,
};