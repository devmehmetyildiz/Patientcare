const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetFloors(req, res, next) {
    PermissionHandler(req, next, 'floorscreen')
}

async function GetFloor(req, res, next) {
    PermissionHandler(req, next, 'floorscreen')
}

async function AddFloor(req, res, next) {
    PermissionHandler(req, next, 'flooradd')
}

async function FastcreateFloor(req, res, next) {
    PermissionHandler(req, next, 'flooradd')
}

async function UpdateFloor(req, res, next) {
    PermissionHandler(req, next, 'floorupdate')
}

async function DeleteFloor(req, res, next) {
    PermissionHandler(req, next, 'floordelete')
}

module.exports = {
    GetFloors,
    GetFloor,
    AddFloor,
    UpdateFloor,
    DeleteFloor,
    FastcreateFloor
}