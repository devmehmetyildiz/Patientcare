const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetFiles(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('filescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Files screen', req.language, { en: 'Files screen ', tr: 'Files screen' }))
    }
}

async function GetbyparentID(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('filescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Files screen', req.language, { en: 'Files screen ', tr: 'Files screen' }))
    }
}

async function GetbyorderfileID(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('filescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Files screen', req.language, { en: 'Files screen ', tr: 'Files screen' }))
    }
}

async function GetFile(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('filescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Files screen', req.language, { en: 'Files screen ', tr: 'Files screen' }))
    }
}

async function Downloadfile(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('filescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Files screen', req.language, { en: 'Files screen ', tr: 'Files screen' }))
    }
}

async function AddFile(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('fileadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Files Add', req.language, { en: 'Files Add ', tr: 'Files Add' }))
    }
}

async function UpdateFile(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('fileupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Files Update', req.language, { en: 'Files Update ', tr: 'Files Update' }))
    }
}

async function DeleteFile(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('filedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Files Delete', req.language, { en: 'Files Delete ', tr: 'Files Delete' }))
    }
}


module.exports = {
    GetFiles,
    GetFile,
    AddFile,
    UpdateFile,
    DeleteFile,
    Downloadfile,
    GetbyparentID,
    GetbyorderfileID
}