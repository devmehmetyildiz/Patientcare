const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetMainteancies(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mainteanceview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mainteancies View', req.language, { en: 'Mainteancies View', tr: 'Mainteancies View' }))
    }
}

async function GetMainteance(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mainteanceview')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mainteancies View', req.language, { en: 'Mainteancies View', tr: 'Mainteancies View' }))
    }
}

async function AddMainteance(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mainteanceadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mainteancies Add', req.language, { en: 'Mainteancies Add', tr: 'Mainteancies Add' }))
    }
}

async function UpdateMainteance(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mainteanceupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mainteancies Update', req.language, { en: 'Mainteancies Update', tr: 'Mainteancies Update' }))
    }
}

async function CompleteMainteance(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mainteanceupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mainteancies Update', req.language, { en: 'Mainteancies Update', tr: 'Mainteancies Update' }))
    }
}

async function DeleteMainteance(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('mainteancedelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Mainteancies Delete', req.language, { en: 'Mainteancies Delete', tr: 'Mainteancies Delete' }))
    }
}

module.exports = {
    GetMainteancies,
    GetMainteance,
    AddMainteance,
    UpdateMainteance,
    DeleteMainteance,
    CompleteMainteance
}