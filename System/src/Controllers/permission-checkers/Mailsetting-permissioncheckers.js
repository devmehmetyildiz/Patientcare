const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetMailsettings(req, res, next) {
    PermissionHandler(req, next, 'mailsettingscreen')
}

async function GetMailsetting(req, res, next) {
    PermissionHandler(req, next, 'mailsettingscreen')
}
async function GetActiveMailsetting(req, res, next) {
    PermissionHandler(req, next, 'mailsettingscreen')
}

async function AddMailsetting(req, res, next) {
    PermissionHandler(req, next, 'mailsettingadd')
}

async function UpdateMailsetting(req, res, next) {
    PermissionHandler(req, next, 'mailsettingupdate')
}

async function DeleteMailsetting(req, res, next) {
    PermissionHandler(req, next, 'mailsettingdelete')
}

module.exports = {
    GetMailsettings,
    GetMailsetting,
    AddMailsetting,
    UpdateMailsetting,
    DeleteMailsetting,
    GetActiveMailsetting
}