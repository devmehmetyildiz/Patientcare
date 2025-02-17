
const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetSurveys(req, res, next) {
    PermissionHandler(req, next, 'surveyscreen')
}

async function GetSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyscreen')
}

async function AddSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyadd')
}

async function UpdateSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyupdate')
}

async function SavepreviewSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveysavepreview')
}

async function ApproveSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyapprove')
}

async function ClearSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyclear')
}

async function CompleteSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveycomplete')
}

async function FillSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyfill')
}

async function RemoveSurveyanswer(req, res, next) {
    PermissionHandler(req, next, 'surveyremoveanswer')
}

async function DeleteSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveydelete')
}

module.exports = {
    GetSurveys,
    GetSurvey,
    AddSurvey,
    UpdateSurvey,
    SavepreviewSurvey,
    ApproveSurvey,
    CompleteSurvey,
    FillSurvey,
    RemoveSurveyanswer,
    ClearSurvey,
    DeleteSurvey
}