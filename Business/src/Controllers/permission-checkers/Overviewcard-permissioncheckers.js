const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetTrainingCountPersonel(req, res, next) {
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

async function GetCompletedFileCountForPatients(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetStayedPatientCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetPatientIncomeOutcome(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

async function GetTrainingCountPatientcontact(req, res, next) {
    PermissionHandler(req, next, 'overviewcardscreen')
}

module.exports = {
    GetTrainingCountPersonel,
    GetPatientvisitCount,
    GetUserincidentCount,
    GetUserLeftCount,
    GetPatientEnterCount,
    GetCompletedFileCountForPatients,
    GetStayedPatientCount,
    GetTrainingCountPatientcontact,
    GetPatientIncomeOutcome
}