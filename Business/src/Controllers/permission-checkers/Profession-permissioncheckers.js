const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetProfessions(req, res, next) {
    PermissionHandler(req, next, 'professionscreen')
}

async function GetProfession(req, res, next) {
    PermissionHandler(req, next, 'professionscreen')
}

async function AddProfession(req, res, next) {
    PermissionHandler(req, next, 'professionadd')
}

async function UpdateProfession(req, res, next) {
    PermissionHandler(req, next, 'professionupdate')
}

async function ApproveProfession(req, res, next) {
    PermissionHandler(req, next, 'professionupdate')
}

async function DeleteProfession(req, res, next) {
    PermissionHandler(req, next, 'professiondelete')
}

module.exports = {
    GetProfessions,
    GetProfession,
    AddProfession,
    ApproveProfession,
    UpdateProfession,
    DeleteProfession,
}