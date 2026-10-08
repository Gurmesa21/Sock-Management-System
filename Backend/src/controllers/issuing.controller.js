const service =
  require("../services/issuing.service");

async function list(req, res, next) {
  try {
    const result =
      await service.listIssues(
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
      await service.getIssueById(
        req.params.id
      );

    res.json({
      success: true,
      data: {
        issue: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function create(req, res, next) {
  try {
    const result =
      await service.createIssue(
        req.auth.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      data: {
        issue: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function complete(req, res, next) {
  try {
    const result =
      await service.completeIssue(
        req.params.id,
        req.auth.user.id
      );

    res.json({
      success: true,
      data: {
        issue: result,
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
  complete,
};