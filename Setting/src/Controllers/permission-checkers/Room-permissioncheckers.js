const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetRooms(req, res, next) {
    PermissionHandler(req, next, 'roomscreen')
}

async function GetRoom(req, res, next) {
    PermissionHandler(req, next, 'roomscreen')
}

async function AddRoom(req, res, next) {
    PermissionHandler(req, next, 'roomadd')
}

async function UpdateRoom(req, res, next) {
    PermissionHandler(req, next, 'roomupdate')
}

async function DeleteRoom(req, res, next) {
    PermissionHandler(req, next, 'roomdelete')
}

module.exports = {
    GetRooms,
    GetRoom,
    AddRoom,
    UpdateRoom,
    DeleteRoom,
}