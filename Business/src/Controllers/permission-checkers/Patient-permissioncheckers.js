const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatients(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}

async function GetPreregistrations(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}

async function GetFullpatients(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}

async function GetPatient(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}

async function AddPatient(req, res, next) {
    PermissionHandler(req, next, 'patientadd')
}
async function AddPatientReturnPatient(req, res, next) {
    PermissionHandler(req, next, 'patientadd')
}

async function Createfromtemplate(req, res, next) {
    PermissionHandler(req, next, 'patientadd')
}

async function Completeprepatient(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function Editpatientstocks(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function UpdatePatient(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function UpdatePatientcase(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function UpdatePatientscase(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function UpdatePatientplace(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function TransferPatientplace(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function UpdatePatienttododefines(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}
async function UpdatePatientsupportplans(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function DeletePatient(req, res, next) {
    PermissionHandler(req, next, 'patientdelete')
}

async function OutPatient(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function InPatient(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}


module.exports = {
    GetPatients,
    Completeprepatient,
    GetFullpatients,
    GetPreregistrations,
    GetPatient,
    AddPatient,
    UpdatePatient,
    UpdatePatientcase,
    UpdatePatienttododefines,
    DeletePatient,
    Editpatientstocks,
    OutPatient,
    InPatient,
    UpdatePatientplace,
    AddPatientReturnPatient,
    Createfromtemplate,
    UpdatePatientsupportplans,
    TransferPatientplace,
    UpdatePatientscase
}