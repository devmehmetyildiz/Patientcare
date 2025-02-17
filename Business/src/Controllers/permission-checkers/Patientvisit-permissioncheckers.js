
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

async function SavepreviewPatientvisit(req, res, next) {
    PermissionHandler(req, next, 'patientvisitsavepreview')
}

async function ApprovePatientvisit(req, res, next) {
    PermissionHandler(req, next, 'patientvisitapprove')
}

async function CompletePatientvisit(req, res, next) {
    PermissionHandler(req, next, 'patientvisitcomplete')
}

async function DeletePatientvisit(req, res, next) {
    PermissionHandler(req, next, 'patientvisitdelete')
}

module.exports = {
    GetPatientvisits,
    GetPatientvisit,
    AddPatientvisit,
    UpdatePatientvisit,
    DeletePatientvisit,
    SavepreviewPatientvisit,
    ApprovePatientvisit,
    CompletePatientvisit,
}