const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetShiftdefines(req, res, next) {
    PermissionHandler(req, next, 'shiftdefinescreen')
}

async function GetShiftdefine(req, res, next) {
    PermissionHandler(req, next, 'shiftdefinescreen')
}

async function AddShiftdefine(req, res, next) {
    PermissionHandler(req, next, 'shiftdefineadd')
}

async function UpdateShiftdefine(req, res, next) {
    PermissionHandler(req, next, 'shiftdefineupdate')
}

async function DeleteShiftdefine(req, res, next) {
    PermissionHandler(req, next, 'shiftdefinedelete')
}

module.exports = {
    GetShiftdefines,
    GetShiftdefine,
    AddShiftdefine,
    UpdateShiftdefine,
    DeleteShiftdefine,
}