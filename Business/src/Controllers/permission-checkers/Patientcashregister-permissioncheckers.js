const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatientcashregisters(req, res, next) {
    PermissionHandler(req, next, 'patientcashregisterscreen')
}

async function GetPatientcashregister(req, res, next) {
    PermissionHandler(req, next, 'patientcashregisterscreen')
}

async function AddPatientcashregister(req, res, next) {
    PermissionHandler(req, next, 'patientcashregisteradd')
}

async function UpdatePatientcashregister(req, res, next) {
    PermissionHandler(req, next, 'patientcashregisterupdate')
}

async function DeletePatientcashregister(req, res, next) {
    PermissionHandler(req, next, 'patientcashregisterdelete')
}

module.exports = {
    GetPatientcashregisters,
    GetPatientcashregister,
    AddPatientcashregister,
    UpdatePatientcashregister,
    DeletePatientcashregister,
}