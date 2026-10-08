const returnService = require("../services/return.service");

async function list(req, res, next) {
  try {
    const result = await returnService.listReturns(req.query);
    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const result = await returnService.createReturn(
      req.auth.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: {
        return: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const result = await returnService.getReturn(req.params.id);

    res.json({
      success: true,
      data: {
        return: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function receive(req, res, next) {
  try {
    const result = await returnService.receiveReturn(
      req.params.id,
      req.auth.user.id
    );

    res.json({
      success: true,
      data: {
        return: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function inspect(req, res, next) {
  try {
    const result = await returnService.inspectReturn(
      req.params.id,
      req.auth.user.id,
      req.body
    );

    res.json({
      success: true,
      data: {
        return: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function approve(req, res, next) {
  try {
    const result = await returnService.approveReturn(
      req.params.id,
      req.auth.user.id
    );

    res.json({
      success: true,
      data: {
        return: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function reject(req, res, next) {
  try {
    const result = await returnService.rejectReturn(
      req.params.id,
      req.auth.user.id,
      req.body?.remarks || req.body?.comments
    );

    res.json({
      success: true,
      data: {
        return: result,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  create,
  getById,
  receive,
  inspect,
  approve,
  reject,
};