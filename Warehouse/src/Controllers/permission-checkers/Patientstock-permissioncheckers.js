const PermissionHandler = require("../../Utilities/PermissionHandler")

async function Transferpatientstock(req, res, next) {
    PermissionHandler(req, next, 'patientscreen')
}

async function GetPatientstocks(req, res, next) {
    PermissionHandler(req, next, 'patientstockscreen','patientmedicinescreen','patientsupplyscreen')
}

async function GetPatientstock(req, res, next) {
    PermissionHandler(req, next, 'patientstockscreen','patientmedicinescreen','patientsupplyscreen')
}

async function AddPatientstock(req, res, next) {
    PermissionHandler(req, next, 'patientstockadd','patientstockadd','patientsupplyadd')
}

async function UpdatePatientstock(req, res, next) {
    PermissionHandler(req, next, 'patientstockupdate','patientmedicineupdate','patientsupplyupdate')
}

async function UpdatePatientstocklist(req, res, next) {
    PermissionHandler(req, next, 'patientstockupdate','patientmedicineupdate','patientsupplyupdate')
}

async function ApprovePatientstock(req, res, next) {
    PermissionHandler(req, next, 'patientstockupdate','patientmedicineupdate','patientsupplyupdate')
}

async function ApprovePatientstocks(req, res, next) {
    PermissionHandler(req, next, 'patientstockupdate','patientmedicineupdate','patientsupplyupdate')
}

async function DeletePatientstock(req, res, next) {
    PermissionHandler(req, next, 'patientstockdelete','patientmedicinedelete','patientsupplydelete')
}


module.exports = {
    GetPatientstocks,
    GetPatientstock,
    AddPatientstock,
    UpdatePatientstock,
    DeletePatientstock,
    Transferpatientstock,
    UpdatePatientstocklist,
    ApprovePatientstock,
    ApprovePatientstocks,
}