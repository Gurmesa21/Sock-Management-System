const service =
  require("../services/user-card.service");

async function create(req, res, next) {
  try {
    const card =
      await service.createCard(
        req.body.userId,
        req.body.departmentId
      );

    res.status(201).json({
      success: true,
      data: { card },
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const card =
      await service.getCard(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "User material card not found.",
      });
    }

    res.json({
      success: true,
      data: { card },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  getById,
};