const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatientdefines(req, res, next) {
    PermissionHandler(req, next, 'patientdefinescreen')
}

async function GetPatientdefine(req, res, next) {
    PermissionHandler(req, next, 'patientdefinescreen')
}

async function AddPatientdefine(req, res, next) {
    PermissionHandler(req, next, 'patientdefineadd')
}

async function UpdatePatientdefine(req, res, next) {
    PermissionHandler(req, next, 'patientdefineupdate')
}

async function DeletePatientdefine(req, res, next) {
    PermissionHandler(req, next, 'patientdefinedelete')
}

module.exports = {
    GetPatientdefines,
    GetPatientdefine,
    AddPatientdefine,
    UpdatePatientdefine,
    DeletePatientdefine,
}