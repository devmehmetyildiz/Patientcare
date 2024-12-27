const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetUsernotifications(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

async function GetUsernotificationsbyUserid(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

async function AddUsernotificationbyrole(req, res, next) {
    PermissionHandler(req, next, 'usernotificationadd')
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

async function GetLastUsernotificationsbyUserid(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

async function ReadAllNotificationByUser(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

async function ShowAllNotificationByUser(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

async function GetUnreadNotificationCountByUser(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

async function GetUnshowedNotificationCountByUser(req, res, next) {
    PermissionHandler(req, next, 'usernotificationscreen')
}

module.exports = {
    GetUsernotifications,
    DeleteUsernotification,
    GetUsernotificationsbyUserid,
    UpdateUsernotifications,
    DeleteUsernotificationbyid,
    DeleteUsernotificationbyidreaded,
    AddUsernotificationbyrole,
    GetLastUsernotificationsbyUserid,
    ReadAllNotificationByUser,
    ShowAllNotificationByUser,
    GetUnreadNotificationCountByUser,
    GetUnshowedNotificationCountByUser,
}