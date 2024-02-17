const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetCareplans(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('careplanview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Careplans View', req.language, { en: 'Careplans View', tr: 'Careplans View' }))
    }
}

async function GetCareplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('careplanview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Careplans View', req.language, { en: 'Careplans View', tr: 'Careplans View' }))
    }
}

async function AddCareplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('careplanadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Careplans Add', req.language, { en: 'Careplans Add', tr: 'Careplans Add' }))
    }
}

async function UpdateCareplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('careplanupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Careplans Update', req.language, { en: 'Careplans Update', tr: 'Careplans Update' }))
    }
}

async function ApproveCareplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('careplanupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Careplans Update', req.language, { en: 'Careplans Update', tr: 'Careplans Update' }))
    }
}

async function DeleteCareplan(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('careplandelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Careplans Delete', req.language, { en: 'Careplans Delete', tr: 'Careplans Delete' }))
    }
}

module.exports = {
    GetCareplans,
    GetCareplan,
    AddCareplan,
    ApproveCareplan,
    UpdateCareplan,
    DeleteCareplan,
}