const service =
  require("../services/requisition.service");

async function create(req, res, next) {
  try {
    const result =
      await service.createRequisition(
        req.auth.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      data: {
        requisition: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function list(req, res, next) {
  try {
    const result =
      await service.listRequisitions(
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
      await service.getRequisitionById(
        req.params.id
      );

    res.json({
      success: true,
      data: {
        requisition: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function update(req, res, next) {
  try {
    const result =
      await service.updateDraft(
        req.params.id,
        req.auth.user.id,
        req.body
      );

    res.json({
      success: true,
      data: {
        requisition: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function submit(req, res, next) {
  try {
    const result =
      await service.submitRequisition(
        req.params.id,
        req.auth.user.id
      );

    res.json({
      success: true,
      data: {
        requisition: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function approve(req, res, next) {
  try {
    const result =
      await service.approveRequisition(
        req.params.id,
        req.auth.user.id,
        req.body
      );

    res.json({
      success: true,
      data: {
        requisition: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function reject(req, res, next) {
  try {
    const result =
      await service.rejectRequisition(
        req.params.id,
        req.auth.user.id,
        req.body.comments
      );

    res.json({
      success: true,
      data: {
        requisition: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function amend(req, res, next) {
  try {
    const result =
      await service.amendRequisition(
        req.params.id,
        req.auth.user.id
      );

    res.json({
      success: true,
      data: {
        requisition: result,
      },
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  create,
  list,
  getById,
  update,
  submit,
  approve,
  reject,
  amend,
};