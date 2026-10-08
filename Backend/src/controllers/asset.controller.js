const assetService =
  require("../services/asset.service");

async function create(req, res, next) {
  try {
    const asset =
      await assetService.createAsset(req.body);

    res.status(201).json({
      success: true,
      data: { asset },
    });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const search = req.query.search || null;

    const result = await assetService.listAssets({ page, limit, search });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const asset =
      await assetService.getAsset(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found.",
      });
    }

    res.json({
      success: true,
      data: { asset },
    });
  } catch (error) {
    next(error);
  }
}

async function assign(req, res, next) {
  try {
    const assignment =
      await assetService.assignAsset(
        req.params.id,
        req.body
      );

    res.json({
      success: true,
      data: { assignment },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  getById,
  assign,
};