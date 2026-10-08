const service =
  require("../services/gate-pass.service");

async function list(req, res, next) {
  try {
    const result = await service.listGatePasses(req.query);
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const gatePass = await service.getGatePassById(req.params.id);
    res.json({
      success: true,
      data: { gatePass },
    });
  } catch (error) {
    next(error);
  }
}

async function listDispatches(req, res, next) {
  try {
    const result = await service.listDispatchRecords(req.query);
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function getDispatchById(req, res, next) {
  try {
    const dispatch = await service.getDispatchRecordById(req.params.id);
    res.json({
      success: true,
      data: { dispatch },
    });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const gatePass =
      await service.createGatePass(
        req.auth.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      data: {
        gatePass,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  try {
    const gatePass =
      await service.verifyGatePass(
        req.params.id,
        req.auth.user.id,
        req.body.remarks
      );

    res.json({
      success: true,
      data: {
        gatePass,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function confirmExit(req, res, next) {
  try {
    const gatePass =
      await service.confirmExit(
        req.params.id,
        req.auth.user.id,
        req.body
      );

    res.json({
      success: true,
      data: {
        gatePass,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function dispatch(req, res, next) {
  try {
    const result =
      await service.recordDispatch(
        req.params.id,
        req.auth.user.id,
        req.body
      );

    res.json({
      success: true,
      data: {
        gatePass: result,
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
  verify,
  confirmExit,
  dispatch,
  listDispatches,
  getDispatchById,
};