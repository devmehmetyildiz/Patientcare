const PermissionHandler = require("../../Utilities/PermissionHandler")

async function GetTrainings(req, res, next) {
    PermissionHandler(req, next, 'trainingscreen')
}

async function GetTraining(req, res, next) {
    PermissionHandler(req, next, 'trainingscreen')
}

async function AddTraining(req, res, next) {
    PermissionHandler(req, next, 'trainingadd')
}

async function UpdateTraining(req, res, next) {
    PermissionHandler(req, next, 'trainingupdate')
}

async function ApproveTraining(req, res, next) {
    PermissionHandler(req, next, 'trainingapprove')
}

async function SavepreviewTraining(req, res, next) {
    PermissionHandler(req, next, 'trainingsavepreview')
}

async function CompleteTraininguser(req, res, next) {
    PermissionHandler(req, next, 'trainingcompleteuser')
}

async function CompleteTraining(req, res, next) {
    PermissionHandler(req, next, 'trainingcomplete')
}

async function CompleteTrainingAll(req, res, next) {
    PermissionHandler(req, next, 'trainingcompleteall')
}

async function DeleteTraining(req, res, next) {
    PermissionHandler(req, next, 'trainingdelete')
}

module.exports = {
    GetTrainings,
    GetTraining,
    AddTraining,
    UpdateTraining,
    DeleteTraining,
    SavepreviewTraining,
    ApproveTraining,
    CompleteTraining,
    CompleteTraininguser,
    CompleteTrainingAll
}