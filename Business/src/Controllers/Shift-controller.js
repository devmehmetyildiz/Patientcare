const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetShifts(req, res, next) {
    try {
        const shifts = await db.shiftModel.findAll()
        res.status(200).json(shifts)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetShift(req, res, next) {

    let validationErrors = []
    if (!req.params.shiftId) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.shiftId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const shift = await db.shiftModel.findOne({ where: { Uuid: req.params.shiftId } });
        res.status(200).json(shift)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddShift(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Starttime,
        Endtime,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Starttime)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTTIME_REQUIRED)
    }
    if (!validator.isString(Endtime)) {
        validationErrors.push(messages.VALIDATION_ERROR.ENDTIME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let shiftuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'


    try {
        await db.shiftModel.create({
            ...req.body,
            Uuid: shiftuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Vardiyalar',
            role: 'shiftnotification',
            message: `${Name} vardiyası ${username} tarafından Eklendi.`,
            pushurl: '/Shifts'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetShifts(req, res, next)
}

async function UpdateShift(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Starttime,
        Endtime,
        Uuid,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isString(Starttime)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTTIME_REQUIRED)
    }
    if (!validator.isString(Endtime)) {
        validationErrors.push(messages.VALIDATION_ERROR.ENDTIME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const shift = db.shiftModel.findOne({ where: { Uuid: Uuid } })
        if (!shift) {
            return next(createNotfounderror([messages.ERROR.SHIFT_NOT_FOUND], req.language))
        }
        if (shift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.SHIFT_NOT_ACTIVE], req.language))
        }

        await db.shiftModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Vardiyalar',
            role: 'shiftnotification',
            message: `${Name} vardiyası ${username} tarafından Güncellendi.`,
            pushurl: '/Shifts'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetShifts(req, res, next)
}

async function DeleteShift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.shiftId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const shift = db.shiftModel.findOne({ where: { Uuid: Uuid } })
        if (!shift) {
            return next(createNotfounderror([messages.ERROR.SHIFT_NOT_FOUND], req.language))
        }
        if (shift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.SHIFT_NOT_ACTIVE], req.language))
        }

        await db.shiftModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Vardiyalar',
            role: 'shiftnotification',
            message: `${shift?.Name} vardiyası ${username} tarafından Silindi.`,
            pushurl: '/Shifts'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetShifts(req, res, next)
}

module.exports = {
    GetShifts,
    GetShift,
    AddShift,
    UpdateShift,
    DeleteShift,
}