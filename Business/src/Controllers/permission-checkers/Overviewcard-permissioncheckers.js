const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetTrainingCountPersonel(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
}

async function GetUserincidentCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
}

async function GetPatientvisitCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
}

async function GetUserLeftCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
}

async function GetPatientEnterCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
}

async function GetCompletedFileCountForPatients(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
}

async function GetStayedPatientCount(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
}

async function GetPatientIncomeOutcome(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
}

async function GetTrainingCountPatientcontact(req, res, next) {
    PermissionHandler(req, next, 'overviewcardview')
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