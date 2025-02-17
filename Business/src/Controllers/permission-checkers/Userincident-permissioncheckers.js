
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

async function SavepreviewUserincident(req, res, next) {
    PermissionHandler(req, next, 'userincidentsavepreview')
}

async function ApproveUserincident(req, res, next) {
    PermissionHandler(req, next, 'userincidentapprove')
}

async function CompleteUserincident(req, res, next) {
    PermissionHandler(req, next, 'userincidentcomplete')
}

async function DeleteUserincident(req, res, next) {
    PermissionHandler(req, next, 'userincidentdelete')
}

module.exports = {
    GetUserincidents,
    GetUserincident,
    AddUserincident,
    UpdateUserincident,
    DeleteUserincident,
    SavepreviewUserincident,
    ApproveUserincident,
    CompleteUserincident,
}