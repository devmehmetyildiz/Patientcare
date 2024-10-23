
const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetUserincidents(req, res, next) {
    PermissionHandler(req, next, 'userincidentscreen')
}

async function GetUserincident(req, res, next) {
    PermissionHandler(req, next, 'userincidentscreen')
}

async function AddUserincident(req, res, next) {
    PermissionHandler(req, next, 'userincidentadd')
}

async function UpdateUserincident(req, res, next) {
    PermissionHandler(req, next, 'userincidentupdate')
}

async function DeleteUserincident(req, res, next) {
    PermissionHandler(req, next, 'userincidentdelete')
}

module.exports = {
    GetUserincidents,
    GetUserincident,
    AddUserincident,
    UpdateUserincident,
    DeleteUserincident
}