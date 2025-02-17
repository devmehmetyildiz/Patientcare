const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetPatients(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}

async function GetPatient(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}
async function GetPatientByPlace(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}

async function AddPatient(req, res, next) {
    PermissionHandler(req, next, 'preregistrationadd')
}

async function UpdatePatient(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function UpdatePatientDates(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function CheckPatient(req, res, next) {
    PermissionHandler(req, next, 'preregistrationcheck')
}

async function ApprovePatient(req, res, next) {
    PermissionHandler(req, next, 'preregistrationapprove')
}

async function CompletePatient(req, res, next) {
    PermissionHandler(req, next, 'preregistrationcomplete')
}

async function CancelCheckPatient(req, res, next) {
    PermissionHandler(req, next, 'preregistrationapprove')
}

async function CancelApprovePatient(req, res, next) {
    PermissionHandler(req, next, 'preregistrationcomplete')
}

async function PatientsRemove(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function PatientsDead(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function PatientsMakeactive(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function Createfromtemplate(req, res, next) {
    PermissionHandler(req, next, 'admin')
}

async function UpdatePatientcase(req, res, next) {
    PermissionHandler(req, next, 'patientupdatecase')
}

async function UpdatePatientscase(req, res, next) {
    PermissionHandler(req, next, 'patientupdatecase')
}

async function UpdatePatientplace(req, res, next) {
    PermissionHandler(req, next, 'patientupdateplace')
}

async function UpdatePatientmovements(req, res, next) {
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

async function DeletePatientmovement(req, res, next) {
    PermissionHandler(req, next, 'patientdelete')
}

async function DeletePreregisrations(req, res, next) {
    PermissionHandler(req, next, 'patientdelete')
}

async function AddPatienteventmovement(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function UpdatePatienteventmovements(req, res, next) {
    PermissionHandler(req, next, 'patientupdate')
}

async function DeletePatienteventmovement(req, res, next) {
    PermissionHandler(req, next, 'patientdelete')
}

async function GetPatientRollCall(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}

module.exports = {
    GetPatients,
    GetPatient,
    AddPatient,
    UpdatePatient,
    UpdatePatientcase,
    UpdatePatienttododefines,
    DeletePatient,
    UpdatePatientplace,
    Createfromtemplate,
    UpdatePatientsupportplans,
    TransferPatientplace,
    UpdatePatientscase,
    CheckPatient,
    ApprovePatient,
    CancelCheckPatient,
    CancelApprovePatient,
    CompletePatient,
    GetPatientByPlace,
    PatientsRemove,
    PatientsDead,
    DeletePreregisrations,
    UpdatePatientDates,
    PatientsMakeactive,
    DeletePatientmovement,
    UpdatePatientmovements,
    AddPatienteventmovement,
    UpdatePatienteventmovements,
    DeletePatienteventmovement,
    GetPatientRollCall
}