const {
  reconcileInventory
} = require("../services/reconciliation.service");

async function reconcile(
  req,
  res,
  next
) {
  try {
    const data =
      await reconcileInventory({
        itemId: req.body.itemId,
        locationId:
          req.body.locationId,
        physicalQuantity:
          req.body.physicalQuantity,
        userId: req.auth.user.id
      });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    if (error.message.includes("not found") || error.message.includes("does not belong")) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
    next(error);
  }
}

module.exports = {
  reconcile
};