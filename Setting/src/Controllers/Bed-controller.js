const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetBeds(req, res, next) {
    try {
        const beds = await db.bedModel.findAll({ where: { Isactive: true } })
        res.status(200).json(beds)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetBed(req, res, next) {

    let validationErrors = []
    if (!req.params.bedId) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
    }
    if (!validator.isUUID(req.params.bedId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BEDID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const bed = await db.bedModel.findOne({ where: { Uuid: req.params.bedId } });
        res.status(200).json(bed)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}



async function AddBed(req, res, next) {

    let validationErrors = []
    const {
        Name,
        RoomID
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let beduuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        await db.bedModel.create({
            ...req.body,
            Uuid: beduuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: 'Yataklar',
            role: 'bednotification',
            message: `${Name} yatağı ${username} tarafından Oluşturuldu.`,
            pushurl: '/Beds'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetBeds(req, res, next)
}

async function UpdateBed(req, res, next) {

    let validationErrors = []
    const {
        Name,
        RoomID,
        Uuid,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isUUID(RoomID)) {
        validationErrors.push(messages.VALIDATION_ERROR.ROOMID_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BEDID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const bed = await db.bedModel.findOne({ where: { Uuid: Uuid } })
        if (!bed) {
            return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
        }
        if (bed.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
        }

        await db.bedModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Yataklar',
            role: 'bednotification',
            message: `${Name} yatağı ${username} tarafından Güncellendi.`,
            pushurl: '/Beds'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetBeds(req, res, next)
}

async function ChangeBedstatus(req, res, next) {

    let validationErrors = []
    const {
        OldUuid,
        NewUuid,
        Status
    } = req.body

    if (!NewUuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
    }
    if (!validator.isUUID(NewUuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BEDID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        if (OldUuid && validator.isUUID(OldUuid)) {
            const oldbed = await db.bedModel.findOne({ where: { Uuid: OldUuid } })
            if (!oldbed) {
                return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
            }
            if (oldbed.Isactive === false) {
                return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
            }

            await db.bedModel.update({
                ...oldbed,
                Isoccupied: false,
                Updateduser: username,
                Updatetime: new Date(),
            }, { where: { Uuid: OldUuid } }, { transaction: t })
        }
        const newBed = await db.bedModel.findOne({ where: { Uuid: NewUuid } })
        if (!newBed) {
            return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
        }
        if (newBed.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
        }

        await db.bedModel.update({
            ...newBed,
            Isoccupied: validator.isBoolean(Status) ? Status : true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: NewUuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Yataklar',
            role: 'bednotification',
            message: `${newBed?.Name} yatağı ${username} tarafından Güncellendi.`,
            pushurl: '/Beds'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetBeds(req, res, next)
}

async function ChangeBedOccupied(req, res, next) {

    let validationErrors = []
    const {
        BedID,
        Isoccupied
    } = req.body

    if (!validator.isUUID(BedID)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BEDID)
    }
    if (!validator.isBoolean(Isoccupied)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISOCCUPIED_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const bed = await db.bedModel.findOne({ where: { Uuid: BedID } })
        if (!bed) {
            return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
        }
        if (bed.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
        }

        await db.bedModel.update({
            ...bed,
            Isoccupied: Isoccupied,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: BedID } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Yataklar',
            role: 'bednotification',
            message: `${bed?.Name} yatağı ${username} tarafından Güncellendi.`,
            pushurl: '/Beds'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetBeds(req, res, next)
}


async function DeleteBed(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.bedId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.BEDID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_BEDID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const bed = await db.bedModel.findOne({ where: { Uuid: Uuid } })
        if (!bed) {
            return next(createNotfounderror([messages.ERROR.BED_NOT_FOUND], req.language))
        }
        if (bed.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.BED_NOT_ACTIVE], req.language))
        }
        await db.bedModel.destroy({ where: { Uuid: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Yataklar',
            role: 'bednotification',
            message: `${bed?.Name} yatağı ${username} tarafından Silindi.`,
            pushurl: '/Beds'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetBeds(req, res, next)
}

module.exports = {
    GetBeds,
    GetBed,
    AddBed,
    UpdateBed,
    DeleteBed,
    ChangeBedstatus,
    ChangeBedOccupied
}