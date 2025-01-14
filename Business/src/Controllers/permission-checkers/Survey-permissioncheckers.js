
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
    PermissionHandler(req, next, 'surveyupdate')
}

async function ApproveSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyupdate')
}

async function ClearSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyupdate')
}

async function CompleteSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyupdate')
}

async function FillSurvey(req, res, next) {
    PermissionHandler(req, next, 'surveyupdate')
}

async function RemoveSurveyanswer(req, res, next) {
    PermissionHandler(req, next, 'surveyupdate')
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