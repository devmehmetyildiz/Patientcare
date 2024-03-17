const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatientmovements(req, res, next) {
    PermissionHandler(req, next, 'patientmovementscreen')
}

async function GetPatientmovement(req, res, next) {
    PermissionHandler(req, next, 'patientmovementscreen')
}

async function AddPatientmovement(req, res, next) {
    PermissionHandler(req, next, 'patientmovementadd')
}

async function UpdatePatientmovement(req, res, next) {
    PermissionHandler(req, next, 'patientmovementupdate')
}

async function DeletePatientmovement(req, res, next) {
    PermissionHandler(req, next, 'patientmovementdelete')
}

module.exports = {
    GetPatientmovements,
    GetPatientmovement,
    AddPatientmovement,
    UpdatePatientmovement,
    DeletePatientmovement,
}