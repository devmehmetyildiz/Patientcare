
const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatientvisits(req, res, next) {
    PermissionHandler(req, next, 'patientvisitscreen')
}

async function GetPatientvisit(req, res, next) {
    PermissionHandler(req, next, 'patientvisitscreen')
}

async function AddPatientvisit(req, res, next) {
    PermissionHandler(req, next, 'patientvisitadd')
}

async function UpdatePatientvisit(req, res, next) {
    PermissionHandler(req, next, 'patientvisitupdate')
}

async function DeletePatientvisit(req, res, next) {
    PermissionHandler(req, next, 'patientvisitdelete')
}

module.exports = {
    GetPatientvisits,
    GetPatientvisit,
    AddPatientvisit,
    UpdatePatientvisit,
    DeletePatientvisit
}