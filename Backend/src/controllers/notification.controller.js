const notification =
  require("../services/notification.service");

async function list(req, res, next) {
  try {
    const result =
      await notification.listNotifications({
        userId: req.auth.user.id,
        ...req.query
      });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

async function markRead(
  req,
  res,
  next
) {
  try {
    const data =
      await notification.markNotificationRead({
        userId: req.auth.user.id,
        notificationId:
          req.params.id
      });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function markAllRead(
  req,
  res,
  next
) {
  try {
    const data =
      await notification.markAllNotificationsRead(
        req.auth.user.id
      );

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  markRead,
  markAllRead
};