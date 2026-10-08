const {
  listAuditLogs,
  getAuditUsers: getAuditUsersService
} = require("../services/audit.service");

async function list(req, res, next) {
  try {
    const data =
      await listAuditLogs(
        req.query
      );

    res.json({
      success: true,
      ...data
    });
  } catch (error) {
    console.error('AUDIT_API_ERROR', error); next(error);
  }
}

async function getAuditUsers(req, res, next) {
  try {
    const data = await getAuditUsersService();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getAuditUsers
};