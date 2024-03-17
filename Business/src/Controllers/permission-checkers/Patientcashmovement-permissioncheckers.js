const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatientcashmovements(req, res, next) {
    PermissionHandler(req, next, 'patientcashmovementscreen')
}

async function GetPatientcashmovement(req, res, next) {
    PermissionHandler(req, next, 'patientcashmovementscreen')
}

async function AddPatientcashmovement(req, res, next) {
    PermissionHandler(req, next, 'patientcashmovementadd')
}

async function UpdatePatientcashmovement(req, res, next) {
    PermissionHandler(req, next, 'patientcashmovementupdate')
}

async function DeletePatientcashmovement(req, res, next) {
    PermissionHandler(req, next, 'patientcashmovementdelete')
}

module.exports = {
    GetPatientcashmovements,
    GetPatientcashmovement,
    AddPatientcashmovement,
    UpdatePatientcashmovement,
    DeletePatientcashmovement,
}