const PermissionHandler = require("../../Utilities/PermissionHandler")


async function GetFiles(req, res, next) {
    PermissionHandler(req, next, 'filescreen')
}

async function GetbyparentID(req, res, next) {
    PermissionHandler(req, next, 'filescreen')
}

async function GetbyorderfileID(req, res, next) {
    PermissionHandler(req, next, 'filescreen')
}

async function GetFile(req, res, next) {
    PermissionHandler(req, next, 'filescreen')
}

async function Downloadfile(req, res, next) {
    PermissionHandler(req, next, 'filescreen')
}

async function AddFile(req, res, next) {
    PermissionHandler(req, next, 'fileadd')
}

async function UpdateFile(req, res, next) {
    PermissionHandler(req, next, 'fileupdate')
}

async function DeleteFile(req, res, next) {
    PermissionHandler(req, next, 'filedelete')
}

async function DeleteFileByParentID(req, res, next) {
    PermissionHandler(req, next, 'filedelete')
}


module.exports = {
    GetFiles,
    GetFile,
    AddFile,
    UpdateFile,
    DeleteFile,
    Downloadfile,
    GetbyparentID,
    GetbyorderfileID,
    DeleteFileByParentID
}