const config = require("../Config")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DoPost = require("../Utilities/DoPost")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotfounderror = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

async function GetPersonelshifts(req, res, next) {
    try {
        const personelshifts = await db.personelshiftModel.findAll()
        res.status(200).json(personelshifts)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPersonelshift(req, res, next) {

    let validationErrors = []
    if (!req.params.personelshiftId) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftIDRequired'))
    }
    if (!validator.isUUID(req.params.personelshiftId)) {
        validationErrors.push(req.t('Personelshifts.Error.UnsupportedPersonelshiftID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: req.params.personelshiftId } });
        personelshift.Personelshiftdetails = await db.personelshiftdetailModel.findAll({ where: { PersonelshiftID: personelshift?.Uuid } })
        res.status(200).json(personelshift)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddPersonelshift(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        ProfessionID,
        Personelshiftdetails
    } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Personelshifts.Error.StartdateRequired'))
    }
    if (!validator.isUUID(ProfessionID)) {
        validationErrors.push(req.t('Personelshifts.Error.ProfessionIDRequired'))
    }
    if (!validator.isArray(Personelshiftdetails)) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftdetailsRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    const previouspersonelshift = await db.personelshiftModel.findOne({ where: { Startdate: Startdate, ProfessionID: ProfessionID } });
    if (previouspersonelshift) {
        return next(createValidationError(req.t('Personelshifts.Error.PersonelshiftDublicated'), req.t('Personelshifts'), req.language))
    }

    let personelshiftuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.personelshiftModel.create({
            ...req.body,
            Uuid: personelshiftuuid,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Isplanactive: false,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const personelshiftdetail of Personelshiftdetails) {

            let detailErrors = []
            if (!validator.isUUID(personelshiftdetail?.ShiftID)) {
                detailErrors.push(req.t('Personelshifts.Error.ShiftIDRequired'))
            }
            if (!validator.isUUID(personelshiftdetail?.PersonelID)) {
                detailErrors.push(req.t('Personelshifts.Error.PersonelIDRequired'))
            }
            if (!validator.isNumber(personelshiftdetail?.Day)) {
                detailErrors.push(req.t('Personelshifts.Error.DayRequired'))
            }
            if (!validator.isBoolean(personelshiftdetail?.Isworking)) {
                detailErrors.push(req.t('Personelshifts.Error.IsworkingRequired'))
            }
            if (!validator.isBoolean(personelshiftdetail?.Isonannual)) {
                detailErrors.push(req.t('Personelshifts.Error.IsonannualRequired'))
            }
            if (!validator.isNumber(personelshiftdetail?.Annualtype)) {
                detailErrors.push(req.t('Personelshifts.Error.AnnualtypeRequired'))
            }
            if (detailErrors.length > 0) {
                return next(createValidationError(detailErrors, req.t('Personelshifts'), req.language))
            }

            let personelshiftdetailuuid = uuid()

            await db.personelshiftdetailModel.create({
                ...personelshiftdetail,
                PersonelshiftID: personelshiftuuid,
                Uuid: personelshiftdetailuuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Personelshifts'),
            role: 'personelshiftnotification',
            message: {
                tr: `${Startdate} Tarihli Personel Vardiyası ${username} tarafından Oluşturuldu.`,
                en: `${Startdate} Dated Personel Shift Created By ${username}`
            }[req.language],
            pushurl: '/Personelshifts'
        })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }

    GetPersonelshifts(req, res, next)
}

async function UpdatePersonelshift(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        ProfessionID,
        Personelshiftdetails,
        Uuid,
    } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(req.t('Personelshifts.Error.StartdateRequired'))
    }
    if (!validator.isUUID(ProfessionID)) {
        validationErrors.push(req.t('Personelshifts.Error.ProfessionIDRequired'))
    }
    if (!validator.isArray(Personelshiftdetails)) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftdetailsRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshifts.Error.UnsupportedPersonelshiftID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror(req.t('Personelshifts.Error.NotFound'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createNotfounderror(req.t('Personelshifts.Error.NotActive'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isonpreview === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotOnPreview'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isapproved === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.Approved'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Iscompleted === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.Completed'), req.t('Personelshifts'), req.language))
        }

        await db.personelshiftModel.update({
            ...req.body,
            Isonpreview: true,
            Isapproved: false,
            Iscompleted: false,
            Isplanactive: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })


        await db.personelshiftdetailModel.destroy({ where: { PersonelshiftID: Uuid }, transaction: t });

        for (const personelshiftdetail of Personelshiftdetails) {

            let detailErrors = []
            if (!validator.isUUID(personelshiftdetail?.ShiftID)) {
                detailErrors.push(req.t('Personelshifts.Error.ShiftIDRequired'))
            }
            if (!validator.isUUID(personelshiftdetail?.PersonelID)) {
                detailErrors.push(req.t('Personelshifts.Error.PersonelIDRequired'))
            }
            if (!validator.isNumber(personelshiftdetail?.Day)) {
                detailErrors.push(req.t('Personelshifts.Error.DayRequired'))
            }
            if (!validator.isBoolean(personelshiftdetail?.Isworking)) {
                detailErrors.push(req.t('Personelshifts.Error.IsworkingRequired'))
            }
            if (!validator.isBoolean(personelshiftdetail?.Isonannual)) {
                detailErrors.push(req.t('Personelshifts.Error.IsonannualRequired'))
            }
            if (!validator.isNumber(personelshiftdetail?.Annualtype)) {
                detailErrors.push(req.t('Personelshifts.Error.AnnualtypeRequired'))
            }
            if (detailErrors.length > 0) {
                return next(createValidationError(detailErrors, req.t('Personelshifts'), req.language))
            }

            let personelshiftdetailuuid = uuid()

            await db.personelshiftdetailModel.create({
                ...personelshiftdetail,
                PersonelshiftID: Uuid,
                Uuid: personelshiftdetailuuid,
                Createduser: username,
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelshifts'),
            role: 'personelshiftnotification',
            message: {
                tr: `${Startdate} Tarihli Personel Vardiyası ${username} tarafından Güncellendi.`,
                en: `${Startdate} Dated Personel Shift Updated By ${username}`
            }[req.language],
            pushurl: '/Personelshifts'
        })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function SavepreviewPersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshifts.Error.UnsupportedPersonelshiftID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotFound'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotActive'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isonpreview === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotOnPreview'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isapproved === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.Approved'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Iscompleted === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.Completed'), req.t('Personelshifts'), req.language))
        }

        await db.personelshiftModel.update({
            Isonpreview: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelshifts'),
            role: 'personelshiftnotification',
            message: {
                tr: `${personelshift?.Startdate} Tarihli Personel Vardiyası ${username} tarafından Kayıt Edildi.`,
                en: `${personelshift?.Startdate} Dated Personel Shift Saved By ${username}`
            }[req.language],
            pushurl: '/Personelshifts'
        })


        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function ApprovePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshifts.Error.UnsupportedPersonelshiftID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotFound'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotActive'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isonpreview === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.OnPreview'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isapproved === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.Approved'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Iscompleted === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.Completed'), req.t('Personelshifts'), req.language))
        }

        await db.personelshiftModel.update({
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelshifts'),
            role: 'personelshiftnotification',
            message: {
                tr: `${personelshift?.Startdate} Tarihli Personel Vardiyası ${username} tarafından Onaylandı.`,
                en: `${personelshift?.Startdate} Dated Personel Shift Approved By ${username}`
            }[req.language],
            pushurl: '/Personelshifts'
        })


        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function CompletePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshifts.Error.UnsupportedPersonelshiftID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotFound'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotActive'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isonpreview === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.OnPreview'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isapproved === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotApproved'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Iscompleted === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.Completed'), req.t('Personelshifts'), req.language))
        }

        await db.personelshiftModel.update({
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelshifts'),
            role: 'personelshiftnotification',
            message: {
                tr: `${personelshift?.Startdate} Tarihli Personel Vardiyası ${username} tarafından Tamamlandı.`,
                en: `${personelshift?.Startdate} Dated Personel Shift Completed By ${username}`
            }[req.language],
            pushurl: '/Personelshifts'
        })


        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function ActivatePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshifts.Error.UnsupportedPersonelshiftID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotFound'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotActive'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isonpreview === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.OnPreview'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isapproved === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotApproved'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Iscompleted === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotCompleted'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isplanactive === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.PlanActive'), req.t('Personelshifts'), req.language))
        }

        await db.personelshiftModel.update({
            Isplanactive: true,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelshifts'),
            role: 'personelshiftnotification',
            message: {
                tr: `${personelshift?.Startdate} Tarihli Personel Vardiyası ${username} tarafından Tamamlandı.`,
                en: `${personelshift?.Startdate} Dated Personel Shift Completed By ${username}`
            }[req.language],
            pushurl: '/Personelshifts'
        })


        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function DeactivatePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshifts.Error.UnsupportedPersonelshiftID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotFound'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotActive'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isonpreview === true) {
            return next(createNotFoundError(req.t('Personelshifts.Error.OnPreview'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isapproved === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotApproved'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Iscompleted === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.NotCompleted'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isplanactive === false) {
            return next(createNotFoundError(req.t('Personelshifts.Error.PlanNotActive'), req.t('Personelshifts'), req.language))
        }

        await db.personelshiftModel.update({
            Isplanactive: false,
            Updateduser: username,
            Updatetime: new Date(),
            Isactive: true
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Personelshifts'),
            role: 'personelshiftnotification',
            message: {
                tr: `${personelshift?.Startdate} Tarihli Personel Vardiyası ${username} tarafından Tamamlandı.`,
                en: `${personelshift?.Startdate} Dated Personel Shift Completed By ${username}`
            }[req.language],
            pushurl: '/Personelshifts'
        })


        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function DeletePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(req.t('Personelshifts.Error.PersonelshiftIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Personelshifts.Error.UnsupportedPersonelshiftID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Personelshifts'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror(req.t('Personelshifts.Error.NotFound'), req.t('Personelshifts'), req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createNotfounderror(req.t('Personelshifts.Error.NotActive'), req.t('Personelshifts'), req.language))
        }

        await db.personelshiftModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.personelshiftdetailModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { PersonelshiftID: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Personelshifts'),
            role: 'personelshiftnotification',
            message: {
                tr: `${personelshift?.Startdate} Tarihli Personel Vardiyası ${username} tarafından Silindi.`,
                en: `${personelshift?.Startdate} Dated Personel Shift Deleted By ${username}`
            }[req.language],
            pushurl: '/Personelshifts'
        })

        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function Getpeparedpersonelshift(req, res, next) {

    try {
        const {
            ProfessionID,
            Startdate,
        } = req.body

        const userConfig = {
            ProfessionID: ProfessionID
        }

        // const Dateoptions = Getdateoptions(1000)
        const startDate = new Date(Startdate)

        const startDay = startDate.getDate()
        const lastDay = Getshiftlastdate(startDate)

        const allshiftdefines = await db.shiftdefineModel.findAll()
        //  const allFloors = await DoGet(config.services.Setting, `Floors`)
        const profession = await db.professionModel.findOne({ where: { Uuid: ProfessionID } });
        const professionFloors = profession?.Floors ? (profession?.Floors || '').split(',') : []
        const shiftdefines = allshiftdefines.filter(u => u.Isactive && !u.Isjoker).sort((a, b) => a.Priority - b.Priority)
        // const jokershifts = allshiftdefines.find(u => u.Isactive && u.Isjoker)
        // vardiyalar ve joker vardiya ayrı ayrı seçildi
        const users = await DoPost(config.services.Userrole, `Users/GetUsersforshift`, userConfig)
        //meslek grubuna ait personeller bulundu

        // calculation ---------------------------------------------------

        //  const previousPersonelshifts = await Getpreviouspersonelshifts(ProfessionID, startDate)
        //bu vardiyadan önceki 4 vardiya bulundu

        /*  const previouspersonelshiftdetails = await db.personelshiftdetailModel.findAll({
             where: {
                 PersonelshiftID: {
                     [Op.in]: previousPersonelshifts.map(personelshift => {
                         return personelshift?.Uuid
                     })
                 },
                 Isstartday: true
             }
         }) */

        let userShifts = []

        if (professionFloors.length > 0) {

            /*   let filledPersonels = shiftdefines.map(shiftdefine => {
                  return {
                      Uuid: shiftdefine.Uuid,
                      Floor: '',
                      Priority: shiftdefine.Priority,
                      Users: []
                  }
              }) */

            for (const floorID of professionFloors) {
                // const floor = allFloors.find(u => u.Uuid === floorID)
                //    const floorGender = floor?.Gender;

                for (const shiftdefine of shiftdefines) {
                    let user = users.find(u => Checkuserforlist(userShifts, u?.Uuid))
                    for (let index = startDay; index <= lastDay; index++) {
                        userShifts.push({
                            ShiftID: shiftdefine?.Uuid,
                            PersonelID: user?.Uuid,
                            FloorID: floorID,
                            Day: index,
                            Isworking: true,
                            Isonannual: false,
                            Annualtype: 0,
                            Isstartday: index === startDay ? true : false
                        })
                    }
                }
            }
        } else {

            let filledPersonels = shiftdefines.map(shiftdefine => {
                return {
                    Uuid: shiftdefine.Uuid,
                    Priority: shiftdefine.Priority,
                    Users: []
                }
            })

            for (const user of users) {
                const shiftdefine = GetShiftforfill(shiftdefines, filledPersonels)
                const selectedShift = filledPersonels.find(u => u.Uuid === shiftdefine?.Uuid)
                if (selectedShift) {
                    selectedShift.Users.push(user)
                }
                for (let index = startDay; index <= lastDay; index++) {
                    userShifts.push({
                        ShiftID: shiftdefine?.Uuid,
                        PersonelID: user?.Uuid,
                        FloorID: "",
                        Day: index,
                        Isworking: true,
                        Isonannual: false,
                        Annualtype: 0,
                        Isstartday: index === startDay ? true : false
                    })
                }
            }
        }

        // bu meslek ile alakalı personeller bulundu
        // ilgili personellere göre önceki vardiyalar bulundu
        // bu meslek ile alakalı katları bul, yoksa tek shiftdönecek ++
        // elde katlar var katlara göre for yap 
        // response u let ile ayarla, eklenecek her personeli oraya tanımla 
        // for döngüsü 

        // vardiya hazırlanacak personelleri bul +
        // personelleri A,B,C ve Joker olarak grupla, gruplarken önceki vardiyalarda nasıl çalıştıklarını bul 
        // hangi vardiyada çalıştığını sadece ilk gün için bul 


        res.status(200).json(userShifts)


    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

/* async function Getpreviouspersonelshifts(ProfessionID, startDate) {
    const Dateoptions = Getdateoptions(1000)
    const startDateorder = Dateoptions.find(u => new Date(u.value).getTime() === startDate.getTime())?.order

    const previousStartdates = [
        startDateorder - 1,
        startDateorder - 2,
        startDateorder - 3,
        startDateorder - 4
    ];

    const previousPersonelshifts = await db.personelshiftModel.findAll({
        where: {
            Startdate: {
                [Op.in]: previousStartdates.map(order => {
                    return new Date(Dateoptions.find(date => date.order === order).value)
                })
            },
            ProfessionID: ProfessionID,
            Isactive: true,
        },
        order: [['Startdate', 'DESC']]
    })

    return previousPersonelshifts
} */

function Checkuserforlist(userShifts, UserID) {
    return (userShifts || []).find(usershift =>
        usershift.PersonelID !== UserID
    ) ? true : false
}

function Getshiftlastdate(inputdate) {
    const startDay = new Date(inputdate).getDate()
    let lastDay = Getshiftstartdate(inputdate)
    if (lastDay === startDay) {
        const start = new Date(inputdate)
        start.setMonth(start.getMonth() + 1)
        start.setDate(0)
        lastDay = start.getDate()
    } else {
        lastDay--;
    }
    return lastDay
}

function Getshiftstartdate(inputdate) {
    const lastdaydate = new Date(inputdate)
    lastdaydate.setMonth(lastdaydate.getMonth() + 1)
    lastdaydate.setDate(0)
    const lastday = lastdaydate.getDate()
    switch (lastday) {
        case 28:
            return 15
        case 29:
            return 16
        case 30:
            return 16
        case 31:
            return 17
        default:
            return 16
    }
}

/* function GetFloorforfill(floors, Filledusers) {
    let selectedFloor = null
    for (const floor of floors) {
        const thisfloorpersonelcount = (Filledusers.find(filledUser => filledUser?.Uuid === shiftdefine?.Uuid)?.Users || []).length;
        const otherfloors = floors?.filter(u => u.Uuid !== shiftdefine?.Uuid && u?.Priority > shiftdefine?.Priority)
        const minpersonelcountedfloors = otherfloors.map(otherfloor => {
            const othershiftpersonelcount = (Filledusers.find(filledUser => filledUser?.Uuid === otherfloor?.Uuid)?.Users || []).length
            if (othershiftpersonelcount < thisshiftpersonelcount) {
                return otherfloor
            }
        }).filter(u => u)

        if (minpersonelcountedshifts.length <= 0) {
            selectedShift = shiftdefine;
            break;
        }
    }
    return selectedShift
} */

function GetShiftforfill(shiftdefines, Filledusers) {
    let selectedShift = null
    for (const shiftdefine of shiftdefines) {
        const thisshiftpersonelcount = (Filledusers.find(filledUser => filledUser?.Uuid === shiftdefine?.Uuid)?.Users || []).length;
        const othershift = shiftdefines?.filter(u => u.Uuid !== shiftdefine?.Uuid && u?.Priority > shiftdefine?.Priority)
        const minpersonelcountedshifts = othershift.map(othershift => {
            const othershiftpersonelcount = (Filledusers.find(filledUser => filledUser?.Uuid === othershift?.Uuid)?.Users || []).length
            if (othershiftpersonelcount < thisshiftpersonelcount) {
                return othershift
            }
        }).filter(u => u)

        if (minpersonelcountedshifts.length <= 0) {
            selectedShift = shiftdefine;
            break;
        }
    }
    return selectedShift
}

module.exports = {
    GetPersonelshifts,
    GetPersonelshift,
    AddPersonelshift,
    UpdatePersonelshift,
    DeletePersonelshift,
    SavepreviewPersonelshift,
    ApprovePersonelshift,
    CompletePersonelshift,
    ActivatePersonelshift,
    DeactivatePersonelshift,
    Getpeparedpersonelshift
}