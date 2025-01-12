const config = require("../Config")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DoPost = require("../Utilities/DoPost")
const DoGet = require("../Utilities/DoGet")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotfounderror = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4

const GENDER_OPTION_MEN = "0"
const GENDER_OPTION_WOMEN = "1"

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

async function GetFastCreatedPersonelshift(req, res, next) {

    try {
        const {
            ProfessionID,
            Startdate,
        } = req.body

        const startDate = new Date(Startdate)
        const startDay = startDate.getDate()
        const lastDay = Getshiftlastdate(startDate)

        const floors = await GetFloors()
        const shiftdefines = await GetShiftdefines()
        const profession = await GetProfession(ProfessionID)


        const professionFloors = profession?.Floors ? (profession?.Floors || '').split(',') : []

        const standartShifts = shiftdefines.filter(u => !u.Isjoker).sort((a, b) => a.Priority - b.Priority)
        const jokershift = shiftdefines.find(u => u.Isjoker)

        const users = await GetUsers(ProfessionID)

        const isGeneralFloor = professionFloors.length <= 0

        let assignedShifts = []; // Atanan vardiyalar
        let maleUsers = []; // Erkek kullanıcılar
        let femaleUsers = []; // Kadın kullanıcılar
        let personelshifts = []

        ShuffleArray(users).forEach(user => {
            if (user.Gender === GENDER_OPTION_MEN) {
                maleUsers.push(user); // Erkek kullanıcılar
            } else {
                femaleUsers.push(user); // Kadın kullanıcılar
            }
        });

        if (isGeneralFloor) {
            assignedShifts = assignToGeneralFloors(maleUsers, femaleUsers, standartShifts, jokershift);
        } else {
            assignedShifts = assignToSpecificFloors(maleUsers, femaleUsers, professionFloors, floors, standartShifts, jokershift);
        }

        assignedShifts.forEach(assignedShift => {
            for (let index = startDay; index <= lastDay; index++) {
                personelshifts.push({
                    ShiftID: assignedShift.ShiftID,
                    PersonelID: assignedShift.PersonelID,
                    FloorID: assignedShift.FloorID,
                    Day: index,
                    Isworking: true,
                    Isonannual: false,
                    Annualtype: 0,
                    Isstartday: index === startDay ? true : false
                })
            }
        });

        res.status(200).json(personelshifts)
    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }
}

function assignToGeneralFloors(maleUsers, femaleUsers, standartShifts, jokershift) {
    let assignedShifts = [];

    femaleUsers.forEach(user => {
        assignedShifts.push(assignShiftToUser(startDate, user, null, standartShifts, jokershift));
    });

    maleUsers.forEach(user => {
        assignedShifts.push(assignShiftToUser(startDate, user, null, standartShifts, jokershift));
    });

    return assignedShifts;
}

function assignToSpecificFloors(maleUsers, femaleUsers, professionFloors, floors, standartShifts, jokershift) {
    let assignedShifts = [];

    femaleUsers.forEach(user => {
        let assigned = false;
        for (let floor of floors) {

            let canAssigFloor = false

            const floorCounts = GetFloorCounts(assignedShifts, floors.filter(floor => floor.Gender === GENDER_OPTION_WOMEN && professionFloors.includes(floor.Uuid)))
            const currentFloorCount = floorCounts.find(u => u.key === floor?.Uuid)?.value || 0
            const lowestFloorCount = floorCounts.reduce((min, obj) => obj.value <= min ? obj.value : min, Infinity)

            if (currentFloorCount <= lowestFloorCount) {
                canAssigFloor = true
            }

            if (floor.Gender === GENDER_OPTION_WOMEN && professionFloors.includes(floor.Uuid) && !assigned && canAssigFloor) {
                assignedShifts.push(assignShiftToUser(user, floor, standartShifts, jokershift, assignedShifts));
                assigned = true;
            }

            if (assigned) {
                break;
            }
        }

        if (!assigned) {
            for (let floor of floors) {

                let canAssigFloor = false

                const floorCounts = GetFloorCounts(assignedShifts, floors.filter(floor => floor.Gender === GENDER_OPTION_MEN && professionFloors.includes(floor.Uuid)))
                const currentFloorCount = floorCounts.find(u => u.key === floor?.Uuid)?.value || 0
                const lowestFloorCount = floorCounts.reduce((min, obj) => obj.value <= min ? obj.value : min, Infinity)

                if (currentFloorCount <= lowestFloorCount) {
                    canAssigFloor = true
                }

                if (floor.Gender === GENDER_OPTION_MEN && professionFloors.includes(floor.Uuid) && !assigned && canAssigFloor) {
                    assignedShifts.push(assignShiftToUser(user, floor, standartShifts, jokershift, assignedShifts));
                    assigned = true;
                }

                if (assigned) {
                    break;
                }
            }
        }
    });

    maleUsers.forEach(user => {
        let assigned = false;

        for (let floor of floors) {

            let canAssigFloor = false

            const floorCounts = GetFloorCounts(assignedShifts, floors.filter(floor => floor.Gender === GENDER_OPTION_MEN && professionFloors.includes(floor.Uuid)))
            const currentFloorCount = floorCounts.find(u => u.key === floor?.Uuid)?.value || 0
            const lowestFloorCount = floorCounts.reduce((min, obj) => obj.value <= min ? obj.value : min, Infinity)

            if (currentFloorCount <= lowestFloorCount) {
                canAssigFloor = true
            }

            if (floor.Gender === GENDER_OPTION_MEN && professionFloors.includes(floor.Uuid) && !assigned && canAssigFloor) {
                assignedShifts.push(assignShiftToUser(user, floor, standartShifts, jokershift, assignedShifts));
                break;
            }

            if (assigned) {
                break;
            }
        }
    });

    return assignedShifts;
}

function assignShiftToUser(user, floor, standartShifts, jokershift, assignedShifts) {

    let shift = null;
    let totalAssignedShiftUsers = floor ? assignedShifts.filter(u => u.FloorID === floor?.Uuid) : assignedShifts

    for (const standartShift of standartShifts) {
        const lowestPriorityShift = getFirstElement([...standartShifts].sort((a, b) => b.Priority - a.Priority))
        const shiftCounts = GetShiftCounts(totalAssignedShiftUsers)
        const currentPriorityShiftCount = shiftCounts.find(u => u.key === standartShift?.Uuid)?.value || 0
        const lowestPriorityShiftCount = shiftCounts.find(u => u.key === lowestPriorityShift?.Uuid)?.value || 0
        if (lowestPriorityShiftCount === currentPriorityShiftCount) {
            shift = standartShift
        }

        if (shift) {
            break;
        }
    }

    return {
        ShiftID: shift ? shift.Uuid : null,
        PersonelID: user.Uuid,
        FloorID: floor ? floor.Uuid : null,
    }
}

function GetShiftCounts(totalAssignedShiftUsers) {
    const shiftArray = totalAssignedShiftUsers.map(u => u.ShiftID)
    const decoratedArray = {};

    shiftArray.forEach(shiftId => {
        decoratedArray[shiftId] = (decoratedArray[shiftId] || 0) + 1;
    });

    return Object.entries(decoratedArray).map(([key, value]) => ({ key, value }));
}

function GetFloorCounts(floorAssignedUserCount, floors) {
    const floorArray = floorAssignedUserCount.map(u => u.FloorID)
    const finalArray = {};
    const decoratedArray = {};

    floorArray.forEach(floorId => {
        decoratedArray[floorId] = (decoratedArray[floorId] || 0) + 1;
    });

    floors.forEach((floor) => {
        finalArray[floor?.Uuid] = decoratedArray[floor?.Uuid] || 0;
    });

    return Object.entries(finalArray).map(([key, value]) => ({ key, value }));
}

function getFirstElement(array) {
    return array.length > 0 ? array[0] : null;
}

async function GetFloors() {
    const allFloors = await DoGet(config.services.Setting, `Floors`)

    return (allFloors || []).filter(u => u.Isactive)
}

function ShuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}

async function GetShiftdefines() {
    return await db.shiftdefineModel.findAll({ where: { Isactive: true } })
}

async function GetProfession(Uuid) {
    return await db.professionModel.findOne({ where: { Uuid: Uuid } });
}

async function GetUsers(Uuid) {
    const userConfig = {
        ProfessionID: Uuid
    }
    return await DoPost(config.services.Userrole, `Users/GetUsersforshift`, userConfig)
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
    GetFastCreatedPersonelshift
}