const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

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
        validationErrors.push(req.t('Shiftdefines.Error.ShiftdefineIDRequired'))
    }
    if (!validator.isUUID(req.params.shiftdefineId)) {
        validationErrors.push(req.t('Shiftdefines.Error.UnsupportedShiftdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Shiftdefines'), req.language))
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
        validationErrors.push(req.t('Shiftdefines.Error.ShiftdefineIDRequired'))
    }
    if (!validator.isString(Starttime)) {
        validationErrors.push(req.t('Shiftdefines.Error.StarttimeRequired'))
    }
    if (!validator.isString(Endtime)) {
        validationErrors.push(req.t('Shiftdefines.Error.EndtimeRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Shiftdefines'), req.language))
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
            service: req.t('Shiftdefines'),
            role: 'shiftdefinenotification',
            message: {
                tr: `${Name} Vardiya Tanımı ${username} tarafından Oluşturuldu.`,
                en: `${Name} Shift Define Created By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Shiftdefines.Error.ShiftdefineIDRequired'))
    }
    if (!validator.isString(Starttime)) {
        validationErrors.push(req.t('Shiftdefines.Error.StarttimeRequired'))
    }
    if (!validator.isString(Endtime)) {
        validationErrors.push(req.t('Shiftdefines.Error.EndtimeRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Shiftdefines.Error.ShiftdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Shiftdefines.Error.UnsupportedShiftdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Shiftdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const shiftdefine = db.shiftdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!shiftdefine) {
            return next(createNotFoundError(req.t('Shiftdefines.Error.NotFound'), req.t('Shiftdefines'), req.language))
        }
        if (shiftdefine.Isactive === false) {
            return next(createNotFoundError(req.t('Shiftdefines.Error.NotActive'), req.t('Shiftdefines'), req.language))
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
            service: req.t('Shiftdefines'),
            role: 'shiftdefinenotification',
            message: {
                tr: `${Name} Vardiya Tanımı ${username} tarafından Güncellendi.`,
                en: `${Name} Shift Define Updated By ${username}`
            }[req.language],
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
        validationErrors.push(req.t('Shiftdefines.Error.ShiftdefineIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Shiftdefines.Error.UnsupportedShiftdefineID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Shiftdefines'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const shiftdefine = db.shiftdefineModel.findOne({ where: { Uuid: Uuid } })
        if (!shiftdefine) {
            return next(createNotFoundError(req.t('Shiftdefines.Error.NotFound'), req.t('Shiftdefines'), req.language))
        }
        if (shiftdefine.Isactive === false) {
            return next(createNotFoundError(req.t('Shiftdefines.Error.NotActive'), req.t('Shiftdefines'), req.language))
        }

        await db.shiftdefineModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Shiftdefines'),
            role: 'shiftdefinenotification',
            message: {
                tr: `${shiftdefine?.Name} Vardiya Tanımı ${username} tarafından Silindi.`,
                en: `${shiftdefine?.Name} Shift Define Deleted By ${username}`
            }[req.language],
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