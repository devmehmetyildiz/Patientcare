const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetLogswithquerry(req, res, next) {
    try {
        const logs = await db.logModel.findAll({ where: { ...req.body } })
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetLogs(req, res, next) {
    try {
        const logs = await db.logModel.findAll({ where: { Isactive: true } })
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddLog(req, res, next) {

    let validationErrors = []

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let loguuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.logModel.create({
            ...req.body,
            Uuid: loguuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
}

module.exports = {
    GetLogswithquerry,
    GetLogs,
    AddLog
}