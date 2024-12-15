const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetTrainingCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetUserincidentCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetPatientvisitCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetUserLeftCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetPatientEnterCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetRequiredFileCountForPatients(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetStayedPatientCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

module.exports = {
    GetTrainingCount,
    GetPatientvisitCount,
    GetUserincidentCount,
    GetUserLeftCount,
    GetPatientEnterCount,
    GetRequiredFileCountForPatients,
    GetStayedPatientCount
}