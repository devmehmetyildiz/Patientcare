const { types } = require("../Constants/Defines")
const messages = require("../Constants/MakingtypeMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetMakingtypes(req, res, next) {
    try {
        const makingtypes = await db.makingtypeModel.findAll({ where: { Isactive: true } })
        res.status(200).json(makingtypes)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetMakingtype(req, res, next) {

    let validationErrors = []
    if (!req.params.makingtypeId) {
        validationErrors.push(messages.VALIDATION_ERROR.MAKINGTYPEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.makingtypeId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAKINGTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const makingtype = await db.makingtypeModel.findOne({ where: { Uuid: req.params.makingtypeId } });
        if (!makingtype) {
            return createNotfounderror([messages.ERROR.MAKINGTYPE_NOT_FOUND])
        }
        if (!makingtype.Isactive) {
            return createNotfounderror([messages.ERROR.MAKINGTYPE_NOT_ACTIVE])
        }
        res.status(200).json(makingtype)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddMakingtype(req, res, next) {

    let validationErrors = []
    const {
        Name,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let makingtypeuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.makingtypeModel.create({
            ...req.body,
            Uuid: makingtypeuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Hizmetin verilme şekilleri',
            role: 'makingtypenotification',
            message: `${Name} hizmet verilme şekli ${username} tarafından Oluşturuldu.`,
            pushurl: '/Makingtypes'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetMakingtypes(req, res, next)
}

async function UpdateMakingtype(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MAKINGTYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAKINGTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const makingtype =await db.makingtypeModel.findOne({ where: { Uuid: Uuid } })
        if (!makingtype) {
            return next(createNotfounderror([messages.ERROR.MAKINGTYPE_NOT_FOUND], req.language))
        }
        if (makingtype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MAKINGTYPE_NOT_ACTIVE], req.language))
        }

        await db.makingtypeModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Hizmetin verilme şekilleri',
            role: 'makingtypenotification',
            message: `${Name} hizmet verilme şekli ${username} tarafından Güncellendi.`,
            pushurl: '/Makingtypes'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetMakingtypes(req, res, next)
}

async function DeleteMakingtype(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.makingtypeId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.MAKINGTYPEID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_MAKINGTYPEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const makingtype =await db.makingtypeModel.findOne({ where: { Uuid: Uuid } })
        if (!makingtype) {
            return next(createNotfounderror([messages.ERROR.MAKINGTYPE_NOT_FOUND], req.language))
        }
        if (makingtype.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.MAKINGTYPE_NOT_ACTIVE], req.language))
        }

        await db.makingtypeModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Hizmetin verilme şekilleri',
            role: 'makingtypenotification',
            message: `${makingtype?.Name} hizmet verilme şekli ${username} tarafından Silindi.`,
            pushurl: '/Makingtypes'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetMakingtypes(req, res, next)
}

module.exports = {
    GetMakingtypes,
    GetMakingtype,
    AddMakingtype,
    UpdateMakingtype,
    DeleteMakingtype,
}