const createAccessDenied = require("../../Utilities/Error").createAccessDenied
const permissionchecker = require("../../Utilities/Permissionchecker")

async function GetRules(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rulescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rules screen', req.language, { en: 'screen Rules', tr: 'screen Rules' }))
    }
}

async function GetRulelogs(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rulescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rules screen', req.language, { en: 'screen Rules', tr: 'screen Rules' }))
    }
}

async function ClearRulelogs(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rulescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rules screen', req.language, { en: 'screen Rules', tr: 'screen Rules' }))
    }
}

async function GetRule(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rulescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rules screen', req.language, { en: 'screen Rules', tr: 'screen Rules' }))
    }
}

async function AddRule(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('ruleadd')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rules Add', req.language, { en: 'Rules Add', tr: 'Rules Add' }))
    }
}

async function UpdateRule(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('ruleupdate')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rules Update', req.language, { en: 'Rules Update', tr: 'Rules Update' }))
    }
}

async function DeleteRule(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('ruledelete')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rules Delete', req.language, { en: 'Rules Delete', tr: 'Rules Delete' }))
    }
}

async function StopRule(req, res, next) {
    if ((req.identity.privileges && req.identity.privileges.includes('rulescreen')) || permissionchecker(req)) {
        next()
    } else {
        next(createAccessDenied('Rules screen', req.language, { en: 'screen Rules', tr: 'screen Rules' }))
    }
}

module.exports = {
    GetRules,
    GetRule,
    AddRule,
    UpdateRule,
    DeleteRule,
    GetRulelogs,
    ClearRulelogs,
    StopRule
}