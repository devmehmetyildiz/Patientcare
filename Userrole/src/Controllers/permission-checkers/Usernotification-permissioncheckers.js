const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetUsernotifications(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function GetUsernotificationsbyUserid(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function AddUsernotificationbyrole(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function UpdateUsernotifications(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function DeleteUsernotification(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function DeleteUsernotificationbyid(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function DeleteUsernotificationbyidreaded(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function GetLastUsernotificationsbyUserid(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function ReadAllNotificationByUser(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function ShowAllNotificationByUser(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function GetUnreadNotificationCountByUser(req, res, next) {
    PermissionHandler(req, next, 'basic')
}

async function GetUnshowedNotificationCountByUser(req, res, next) {
    PermissionHandler(req, next, 'basic')
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