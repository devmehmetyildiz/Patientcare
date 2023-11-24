const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetMainteancies(req, res, next) {
    try {
        const mainteancies = await db.mainteanceModel.findAll({ where: { Isactive: true } })
        res.status(200).json(mainteancies)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetMainteance(req, res, next) {

    let validationErrors = []
    if (!req.params.mainteanceId) {
        validationErrors.push(messages.VALIDATION_ERROR.MAINTEANCEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.mainteanceId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAINTEANCEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const mainteance = await db.mainteanceModel.findOne({ where: { Uuid: req.params.mainteanceId } });
        if (!mainteance) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_FOUND], req.language))
        }
        if (!mainteance.Isactive) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_ACTIVE], req.language))
        }
        res.status(200).json(mainteance)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddMainteance(req, res, next) {

    let validationErrors = []
    const {
        Starttime,
        EquipmentID,
        ResponsibleuserID,
    } = req.body

    if (!validator.isISODate(Starttime)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTTIME_REQUIRED)
    }
    if (!validator.isUUID(EquipmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTID_REQUIRED)
    }
    if (!validator.isUUID(ResponsibleuserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let mainteanceuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.mainteanceModel.create({
            ...req.body,
            Uuid: mainteanceuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
    GetMainteancies(req, res, next)
}

async function UpdateMainteance(req, res, next) {

    let validationErrors = []
    const {
        Uuid,
        Starttime,
        EquipmentID,
        ResponsibleuserID,
    } = req.body

    if (!validator.isISODate(Starttime)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTTIME_REQUIRED)
    }
    if (!validator.isUUID(EquipmentID)) {
        validationErrors.push(messages.VALIDATION_ERROR.EQUIPMENTID_REQUIRED)
    }
    if (!validator.isUUID(ResponsibleuserID)) {
        validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MAINTEANCEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAINTEANCEID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    try {
        const mainteance = db.mainteanceModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteance) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_FOUND], req.language))
        }
        if (mainteance.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MAINTEANCE_NOT_ACTIVE], req.language))
        }

        await db.mainteanceModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteancies(req, res, next)
}

async function DeleteMainteance(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.mainteanceId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MAINTEANCEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAINTEANCEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const mainteance = db.mainteanceModel.findOne({ where: { Uuid: Uuid } })
        if (!mainteance) {
            return next(createNotfounderror([messages.ERROR.MAINTEANCE_NOT_FOUND], req.language))
        }
        if (mainteance.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MAINTEANCE_NOT_ACTIVE], req.language))
        }

        await db.mainteanceModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetMainteancies(req, res, next)
}

module.exports = {
    GetMainteancies,
    GetMainteance,
    AddMainteance,
    UpdateMainteance,
    DeleteMainteance,
}