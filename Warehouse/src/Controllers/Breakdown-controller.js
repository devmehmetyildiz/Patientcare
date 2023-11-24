const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetBreakdowns(req, res, next) {
    try {
        const breakdowns = await db.breakdownModel.findAll({ where: { Isactive: true } })
        res.status(200).json(breakdowns)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetBreakdown(req, res, next) {

    let validationErrors = []
    if (!req.params.breakdownId) {
        validationErrors.push(messages.VALIDATION_ERROR.BREAKDOWNID_REQUIRED)
    }
    if (!validator.isUUID(req.params.breakdownId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BREAKDOWNID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const breakdown = await db.breakdownModel.findOne({ where: { Uuid: req.params.breakdownId } });
        if (!breakdown) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_FOUND], req.language))
        }
        if (!breakdown.Isactive) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_ACTIVE], req.language))
        }
        res.status(200).json(breakdown)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddBreakdown(req, res, next) {

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

    let breakdownuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.breakdownModel.create({
            ...req.body,
            Uuid: breakdownuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        next(sequelizeErrorCatcher(err))
    }
    GetBreakdowns(req, res, next)
}

async function UpdateBreakdown(req, res, next) {

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
        validationErrors.push(messages.VALIDATION_ERROR.BREAKDOWNID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BREAKDOWNID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    try {
        const breakdown = db.breakdownModel.findOne({ where: { Uuid: Uuid } })
        if (!breakdown) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_FOUND], req.language))
        }
        if (breakdown.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BREAKDOWN_NOT_ACTIVE], req.language))
        }

        await db.breakdownModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetBreakdowns(req, res, next)
}

async function DeleteBreakdown(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.breakdownId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BREAKDOWNID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BREAKDOWNID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const breakdown = db.breakdownModel.findOne({ where: { Uuid: Uuid } })
        if (!breakdown) {
            return next(createNotfounderror([messages.ERROR.BREAKDOWN_NOT_FOUND], req.language))
        }
        if (breakdown.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BREAKDOWN_NOT_ACTIVE], req.language))
        }

        await db.breakdownModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetBreakdowns(req, res, next)
}

module.exports = {
    GetBreakdowns,
    GetBreakdown,
    AddBreakdown,
    UpdateBreakdown,
    DeleteBreakdown,
}