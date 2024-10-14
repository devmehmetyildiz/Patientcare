const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher, } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetSupportplanlists(req, res, next) {
    try {
        const supportplanlists = await db.supportplanlistModel.findAll()
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
        validationErrors.push(req.t('Supportplanlists.Error.SupportplanlistIDRequired'))
    }
    if (!validator.isUUID(req.params.supportplanlistId)) {
        validationErrors.push(req.t('Supportplanlists.Error.UnsupportedSupportplanlistID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Supportplanlists'), req.language))
    }

    try {
        const supportplanlist = await db.supportplanlistModel.findOne({ where: { Uuid: req.params.supportplanlistId } });
        if (!supportplanlist) {
            return createNotFoundError(req.t('Supportplanlists.Error.NotFound'), req.t('Supportplanlists'), req.language)
        }
        if (!supportplanlist.Isactive) {
            return createNotFoundError(req.t('Supportplanlists.Error.NotActive'), req.t('Supportplanlists'), req.language)
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
        validationErrors.push(req.t('Supportplanlists.Error.NameRequired'))
    }
    if (!validator.isArray(Supportplans)) {
        validationErrors.push(req.t('Supportplanlists.Error.SupportplansRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Supportplanlists'), req.language))
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
                return next(createValidationError(req.t('Supportplanlists.Error.UnsupportedSupportplanID'), req.t('Supportplanlists'), req.language))
            }
            await db.supportplanlistsupportplanModel.create({
                ListID: supportplanlistuuid,
                PlanID: supportplan.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Supportplanlists'),
            role: 'supportplanlistnotification',
            message: {
                en: `${Name} Supportplan List Created By ${username}.`,
                tr: `${Name} Destek Plan Listesi ${username} Tarafından Oluşturuldu.`
            }[req.language],
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
        validationErrors.push(req.t('Supportplanlists.Error.NameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Supportplanlists.Error.SupportplanlistIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Supportplanlists.Error.UnsupportedSupportplanlistID'))
    }
    if (!validator.isArray(Supportplans)) {
        validationErrors.push(req.t('Supportplanlists.Error.SupportplansRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Supportplanlists'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const supportplanlist = await db.supportplanlistModel.findOne({ where: { Uuid: Uuid } });
        if (!supportplanlist) {
            return createNotFoundError(req.t('Supportplanlists.Error.NotFound'), req.t('Supportplanlists'), req.language)
        }
        if (!supportplanlist.Isactive) {
            return createNotFoundError(req.t('Supportplanlists.Error.NotActive'), req.t('Supportplanlists'), req.language)
        }


        await db.supportplanlistModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.supportplanlistsupportplanModel.destroy({ where: { ListID: Uuid }, transaction: t });
        for (const supportplan of Supportplans) {
            if (!supportplan.Uuid || !validator.isUUID(supportplan.Uuid)) {
                return next(createValidationError(req.t('Supportplanlists.Error.UnsupportedSupportplanID'), req.t('Supportplanlists'), req.language))
            }
            await db.supportplanlistsupportplanModel.create({
                ListID: Uuid,
                PlanID: supportplan.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Supportplanlists'),
            role: 'supportplanlistnotification',
            message: {
                en: `${Name} Supportplan List Updated By ${username}.`,
                tr: `${Name} Destek Plan Listesi ${username} Tarafından Güncellendi.`
            }[req.language],
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
        validationErrors.push(req.t('Supportplanlists.Error.SupportplanlistIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Supportplanlists.Error.UnsupportedSupportplanlistID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Supportplanlists'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const supportplanlist = await db.supportplanlistModel.findOne({ where: { Uuid: Uuid } });
        if (!supportplanlist) {
            return createNotFoundError(req.t('Supportplanlists.Error.NotFound'), req.t('Supportplanlists'), req.language)
        }
        if (!supportplanlist.Isactive) {
            return createNotFoundError(req.t('Supportplanlists.Error.NotActive'), req.t('Supportplanlists'), req.language)
        }

        await db.supportplanlistModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Supportplanlists'),
            role: 'supportplanlistnotification',
            message: {
                en: `${supportplanlist?.Name} Supportplan List Deleted By ${username}.`,
                tr: `${supportplanlist?.Name} Destek Plan Listesi ${username} Tarafından Silindi.`
            }[req.language],
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