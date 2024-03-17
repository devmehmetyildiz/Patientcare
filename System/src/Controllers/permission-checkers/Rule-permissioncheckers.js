const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetRules(req, res, next) {
    PermissionHandler(req, next, 'rulescreen')
}

async function GetRulelogs(req, res, next) {
    PermissionHandler(req, next, 'rulescreen')
}

async function ClearRulelogs(req, res, next) {
    PermissionHandler(req, next, 'rulescreen')
}

async function GetRule(req, res, next) {
    PermissionHandler(req, next, 'rulescreen')
}

async function AddRule(req, res, next) {
    PermissionHandler(req, next, 'ruleadd')
}

async function UpdateRule(req, res, next) {
    PermissionHandler(req, next, 'ruleupdate')
}

async function DeleteRule(req, res, next) {
    PermissionHandler(req, next, 'ruledelete')
}

async function StopRule(req, res, next) {
    PermissionHandler(req, next, 'rulescreen')
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