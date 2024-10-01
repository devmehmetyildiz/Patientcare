const { types } = require("../Constants/Defines")
const messages = require("../Constants/Messages")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetSupportplanlists(req, res, next) {
    try {
        const supportplanlists = await db.supportplanlistModel.findAll({ where: { Isactive: true } })
        for (const supportplanlist of supportplanlists) {
            supportplanlist.Supportplanuuids = await db.supportplanlistsupportplanModel.findAll({
                where: {
                    ListID: supportplanlist.Uuid,
                },
                attributes: ['PlanID']
            });
        }
        res.status(200).json(supportplanlists)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetSupportplanlist(req, res, next) {

    let validationErrors = []
    if (!req.params.supportplanlistId) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANLISTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.supportplanlistId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANLISTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const supportplanlist = await db.supportplanlistModel.findOne({ where: { Uuid: req.params.supportplanlistId } });
        if (!supportplanlist) {
            return createNotfounderror([messages.ERROR.SUPPORTPLANLIST_NOT_FOUND])
        }
        if (!supportplanlist.Isactive) {
            return createNotfounderror([messages.ERROR.SUPPORTPLANLIST_NOT_ACTIVE])
        }
        supportplanlist.Supportplanuuids = await db.supportplanlistsupportplanModel.findAll({
            where: {
                ListID: supportplanlist.Uuid,
            },
            attributes: ['PlanID']
        });
        res.status(200).json(supportplanlist)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddSupportplanlist(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Supportplans,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!validator.isArray(Supportplans)) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let supportplanlistuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.supportplanlistModel.create({
            ...req.body,
            Uuid: supportplanlistuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const supportplan of Supportplans) {
            if (!supportplan.Uuid || !validator.isUUID(supportplan.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANID, req.language))
            }
            await db.supportplanlistsupportplanModel.create({
                ListID: supportplanlistuuid,
                PlanID: supportplan.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: 'Destek Plan Listeleri',
            role: 'supportplanlistnotification',
            message: `${Name} destek plan listesi ${username} tarafından Oluşturuldu.`,
            pushurl: '/Supportplanlists'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetSupportplanlists(req, res, next)
}

async function UpdateSupportplanlist(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Supportplans,
        Uuid
    } = req.body
    if (!validator.isString(Name)) {
        validationErrors.push(messages.VALIDATION_ERROR.NAME_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANLISTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANLISTID)
    }
    if (!validator.isArray(Supportplans)) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANS_REQUIRED)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const supportplanlist = await db.supportplanlistModel.findOne({ where: { Uuid: Uuid } });
        if (!supportplanlist) {
            return createNotfounderror([messages.ERROR.SUPPORTPLANLIST_NOT_FOUND])
        }
        if (!supportplanlist.Isactive) {
            return createNotfounderror([messages.ERROR.SUPPORTPLANLIST_NOT_ACTIVE])
        }


        await db.supportplanlistModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.supportplanlistsupportplanModel.destroy({ where: { ListID: Uuid }, transaction: t });
        for (const supportplan of Supportplans) {
            if (!supportplan.Uuid || !validator.isUUID(supportplan.Uuid)) {
                return next(createValidationError(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANID, req.language))
            }
            await db.supportplanlistsupportplanModel.create({
                ListID: Uuid,
                PlanID: supportplan.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: 'Destek Plan Listeleri',
            role: 'supportplanlistnotification',
            message: `${Name} destek plan listesi ${username} tarafından Güncellendi.`,
            pushurl: '/Supportplanlists'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetSupportplanlists(req, res, next)

}

async function DeleteSupportplanlist(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.supportplanlistId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SUPPORTPLANLISTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SUPPORTPLANLISTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const supportplanlist = await db.supportplanlistModel.findOne({ where: { Uuid: Uuid } });
        if (!supportplanlist) {
            return createNotfounderror([messages.ERROR.SUPPORTPLANLIST_NOT_FOUND])
        }
        if (!supportplanlist.Isactive) {
            return createNotfounderror([messages.ERROR.SUPPORTPLANLIST_NOT_ACTIVE])
        }

        await db.supportplanlistModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: 'Destek Plan Listeleri',
            role: 'supportplanlistnotification',
            message: `${supportplanlist?.Name} destek plan listesi ${username} tarafından Silindi.`,
            pushurl: '/Supportplanlists'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetSupportplanlists(req, res, next)
}

module.exports = {
    GetSupportplanlists,
    GetSupportplanlist,
    AddSupportplanlist,
    UpdateSupportplanlist,
    DeleteSupportplanlist,
}