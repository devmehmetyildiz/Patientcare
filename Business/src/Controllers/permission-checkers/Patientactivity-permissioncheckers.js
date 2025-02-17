
const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatientactivities(req, res, next) {
    PermissionHandler(req, next, 'patientactivityscreen')
}

async function GetPatientactivity(req, res, next) {
    PermissionHandler(req, next, 'patientactivityscreen')
}

async function AddPatientactivity(req, res, next) {
    PermissionHandler(req, next, 'patientactivityadd')
}

async function UpdatePatientactivity(req, res, next) {
    PermissionHandler(req, next, 'patientactivityupdate')
}

async function SavepreviewPatientactivity(req, res, next) {
    PermissionHandler(req, next, 'patientactivitysavepreview')
}

async function ApprovePatientactivity(req, res, next) {
    PermissionHandler(req, next, 'patientactivityapprove')
}

async function CompletePatientactivity(req, res, next) {
    PermissionHandler(req, next, 'patientactivitycomplete')
}

async function DeletePatientactivity(req, res, next) {
    PermissionHandler(req, next, 'patientactivitydelete')
}

module.exports = {
    GetPatientactivities,
    GetPatientactivity,
    AddPatientactivity,
    UpdatePatientactivity,
    SavepreviewPatientactivity,
    ApprovePatientactivity,
    CompletePatientactivity,
    DeletePatientactivity
}