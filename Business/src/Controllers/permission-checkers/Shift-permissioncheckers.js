const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetShifts(req, res, next) {
    PermissionHandler(req, next, 'shiftscreen')
}
async function GetShiftrequests(req, res, next) {
    PermissionHandler(req, next, 'shiftscreen')
}

async function GetShiftrequest(req, res, next) {
    PermissionHandler(req, next, 'shiftscreen')
}

async function GetPersonelshifts(req, res, next) {
    PermissionHandler(req, next, 'shiftscreen')
}

async function GetShift(req, res, next) {
    PermissionHandler(req, next, 'shiftscreen')
}

async function AddShift(req, res, next) {
    PermissionHandler(req, next, 'shiftadd')
}

async function Addshiftperiod(req, res, next) {
    PermissionHandler(req, next, 'shiftadd')
}

async function UpdateShift(req, res, next) {
    PermissionHandler(req, next, 'shiftupdate')
}

async function DeleteShift(req, res, next) {
    PermissionHandler(req, next, 'shiftdelete')
}

async function DeleteShiftrequest(req, res, next) {
    PermissionHandler(req, next, 'shiftdelete')
}

module.exports = {
    GetShifts,
    GetShift,
    AddShift,
    UpdateShift,
    DeleteShift,
    Addshiftperiod,
    GetShiftrequests,
    GetPersonelshifts,
    GetShiftrequest,
    DeleteShiftrequest
}