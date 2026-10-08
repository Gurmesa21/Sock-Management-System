const service =
  require("../services/issue-voucher.service");


async function list(req, res, next) {
  try {
    const result =
      await service.listVouchers(
        req.query
      );

    res.json({
      success: true,
      data: result.data,
      pagination:
        result.pagination,
    });
  } catch (error) {
    next(error);
  }
}


async function getById(req, res, next) {
  try {
    const result =
      await service.getVoucherById(
        req.params.id
      );

    res.json({
      success: true,
      data: {
        voucher: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function create(req, res, next) {
  try {
    const result =
      await service.createVoucher(
        req.auth.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      data: {
        voucher: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  list,
  getById,
  create,
};