const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/ShiftdefineMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetShiftdefines(req, res, next) {
    try {
        const shiftdefines = await db.shiftdefineModel.findAll()
        res.status(200).json(shiftdefines)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetShiftdefine(req, res, next) {

    let validationErrors = []
    if (!req.params.shiftdefineId) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.shiftdefineId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const shiftdefine = await db.shiftdefineModel.findOne({ where: { Uuid: req.params.shiftdefineId } });
        res.status(200).json(shiftdefine)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddShiftdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Starttime,
        Endtime,
        Isjoker
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

    let shiftdefineuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'


    try {
        if (Isjoker) {
            await db.shiftdefineModel.update({
                Isjoker: false
            }, { where: { Isactive: true }, transaction: t })
        }

        await db.shiftdefineModel.create({
            ...req.body,
            Uuid: shiftdefineuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })


        await CreateNotification({
            type: types.Create,
            service: 'Vardiya Tanımları',
            role: 'shiftdefinenotification',
            message: `${Name} vardiya tanımı ${username} tarafından Eklendi.`,
            pushurl: '/Shiftdefines'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetShiftdefines(req, res, next)
}

async function UpdateShiftdefine(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Starttime,
        Endtime,
        Uuid,
        Isjoker
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
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const shiftdefine = db.shiftdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!shiftdefine) {
            return next(createNotfounderror([messages.ERROR.SHIFTDEFINE_NOT_FOUND], req.language))
        }
        if (shiftdefine.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.SHIFTDEFINE_NOT_ACTIVE], req.language))
        }

        if (Isjoker) {
            await db.shiftdefineModel.update({
                Isjoker: false
            }, { where: { Isactive: true }, transaction: t })
        }

        await db.shiftdefineModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Vardiya Tanımları',
            role: 'shiftdefinenotification',
            message: `${Name} vardiya tanımı ${username} tarafından Güncellendi.`,
            pushurl: '/Shiftdefines'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetShiftdefines(req, res, next)
}

async function DeleteShiftdefine(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.shiftdefineId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTDEFINEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTDEFINEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const shiftdefine = db.shiftdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!shiftdefine) {
            return next(createNotfounderror([messages.ERROR.SHIFTDEFINE_NOT_FOUND], req.language))
        }
        if (shiftdefine.Isactive === false) {
            return next(createNotfounderror([messages.ERROR.SHIFTDEFINE_NOT_ACTIVE], req.language))
        }

        await db.shiftdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Vardiya Tanımları',
            role: 'shiftdefinenotification',
            message: `${shiftdefine?.Name} vardiyası ${username} tarafından Silindi.`,
            pushurl: '/Shiftdefines'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetShiftdefines(req, res, next)
}

module.exports = {
    GetShiftdefines,
    GetShiftdefine,
    AddShiftdefine,
    UpdateShiftdefine,
    DeleteShiftdefine,
}