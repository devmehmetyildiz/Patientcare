const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetUsernotifications(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

async function GetUsernotification(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

async function GetUsernotificationsbyUserid(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}
async function AddUsernotification(req, res, next) {
    PermissionHandler(req, next, 'usernotificationadd')
}
async function AddUsernotificationbyrole(req, res, next) {
    PermissionHandler(req, next, 'usernotificationadd')
}

async function UpdateUsernotification(req, res, next) {
    PermissionHandler(req, next, 'usernotificationupdate')
}
async function UpdateUsernotifications(req, res, next) {
    PermissionHandler(req, next, 'usernotificationupdate')
}

async function DeleteUsernotification(req, res, next) {
    PermissionHandler(req, next, 'usernotificationdelete')
}

async function DeleteUsernotificationbyid(req, res, next) {
    PermissionHandler(req, next, 'usernotificationdelete')
}

async function DeleteUsernotificationbyidreaded(req, res, next) {
    PermissionHandler(req, next, 'usernotificationdelete')
}


module.exports = {
    GetUsernotifications,
    GetUsernotification,
    AddUsernotification,
    UpdateUsernotification,
    DeleteUsernotification,
    GetUsernotificationsbyUserid,
    UpdateUsernotifications,
    DeleteUsernotificationbyid,
    DeleteUsernotificationbyidreaded,
    AddUsernotificationbyrole
}