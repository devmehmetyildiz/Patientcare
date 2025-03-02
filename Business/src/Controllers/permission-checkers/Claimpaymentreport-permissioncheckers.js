const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetClaimpaymentReport(req, res, next) {
    PermissionHandler(req, next, 'claimpaymentmanagereport')
}

module.exports = {
    GetClaimpaymentReport,
}