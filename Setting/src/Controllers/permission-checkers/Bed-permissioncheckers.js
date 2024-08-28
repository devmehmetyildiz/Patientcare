const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetBeds(req, res, next) {
    PermissionHandler(req, next, 'bedscreen')
}

async function GetBed(req, res, next) {
    PermissionHandler(req, next, 'bedscreen')
}

async function AddBed(req, res, next) {
    PermissionHandler(req, next, 'bedadd')
}

async function UpdateBed(req, res, next) {
    PermissionHandler(req, next, 'bedupdate')
}

async function ChangeBedstatus(req, res, next) {
    PermissionHandler(req, next, 'bedupdate')
}

async function ChangeBedOccupied(req, res, next) {
    PermissionHandler(req, next, 'bedupdate')
}

async function DeleteBed(req, res, next) {
    PermissionHandler(req, next, 'beddelete')
}

module.exports = {
    GetBeds,
    GetBed,
    AddBed,
    UpdateBed,
    DeleteBed,
    ChangeBedstatus,
    ChangeBedOccupied
}