const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/PersonelshiftMessages")
const personelshiftdetailMessages = require("../Constants/PersonelshiftdetailMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const DoPost = require("../Utilities/DoPost")
const DoGet = require("../Utilities/DoGet")
const { Getdateoptions } = require("../Utilities/Formatdate")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')
const { Op } = require("sequelize")

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
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.personelshiftId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
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
        Isworking,
        Isdeactive,
        Iscompleted,
        Isapproved,
        Personelshiftdetails
    } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }
    if (!validator.isUUID(ProfessionID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (!validator.isBoolean(Isworking)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWORKING_REQUIRED)
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED)
    }
    if (!validator.isBoolean(Iscompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISCOMPLETED_REQUIRED)
    }
    if (!validator.isBoolean(Isapproved)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISAPPROVED_REQUIRED)
    }
    if (!validator.isArray(Personelshiftdetails)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIFTDETAILS_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const previouspersonelshift = await db.personelshiftModel.findOne({ where: { Startdate: Startdate, ProfessionID: ProfessionID } });
    if (previouspersonelshift) {
        return next(createValidationError([messages.VALIDATION_ERROR.PERSONELSHIIFT_DUBLICATED], req.language))
    }

    let personelshiftuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.personelshiftModel.create({
            ...req.body,
            Uuid: personelshiftuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const personelshiftdetail of Personelshiftdetails) {

            let detailErrors = []
            if (!validator.isUUID(personelshiftdetail?.ShiftID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.SHIFTID_REQUIRED)
            }
            if (!validator.isUUID(personelshiftdetail?.PersonelID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.PERSONELID_REQUIRED)
            }
            if (!validator.isNumber(personelshiftdetail?.Day)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.DAY_REQUIRED)
            }
            if (!validator.isBoolean(personelshiftdetail?.Isworking)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ISWORKING_REQUIRED)
            }
            if (!validator.isBoolean(personelshiftdetail?.Isonannual)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ISONANNUAL_REQUIRED)
            }
            if (!validator.isNumber(personelshiftdetail?.Annualtype)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ANNUALTYPE_REQUIRED)
            }
            if (detailErrors.length > 0) {
                return next(createValidationError(detailErrors, req.language))
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
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${personelshiftuuid} numaralı personel vardiyası ${username} tarafından Eklendi.`,
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
        Isworking,
        Isdeactive,
        Iscompleted,
        Isapproved,
        Personelshiftdetails,
        Uuid,
    } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }
    if (!validator.isUUID(ProfessionID)) {
        validationErrors.push(messages.VALIDATION_ERROR.PROFESSIONID_REQUIRED)
    }
    if (!validator.isBoolean(Isworking)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISWORKING_REQUIRED)
    }
    if (!validator.isBoolean(Isdeactive)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISDEACTIVE_REQUIRED)
    }
    if (!validator.isBoolean(Iscompleted)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISCOMPLETED_REQUIRED)
    }
    if (!validator.isBoolean(Isapproved)) {
        validationErrors.push(messages.VALIDATION_ERROR.ISAPPROVED_REQUIRED)
    }
    if (!validator.isArray(Personelshiftdetails)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIFTDETAILS_REQUIRED)
    }
    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_FOUND], req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }

        await db.personelshiftModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await db.personelshiftdetailModel.destroy({ where: { PersonelshiftID: Uuid }, transaction: t });

        for (const personelshiftdetail of Personelshiftdetails) {

            let detailErrors = []
            if (!validator.isUUID(personelshiftdetail?.ShiftID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.SHIFTID_REQUIRED)
            }
            if (!validator.isUUID(personelshiftdetail?.PersonelID)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.PERSONELID_REQUIRED)
            }
            if (!validator.isNumber(personelshiftdetail?.Day)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.DAY_REQUIRED)
            }
            if (!validator.isBoolean(personelshiftdetail?.Isworking)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ISWORKING_REQUIRED)
            }
            if (!validator.isBoolean(personelshiftdetail?.Isonannual)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ISONANNUAL_REQUIRED)
            }
            if (!validator.isNumber(personelshiftdetail?.Annualtype)) {
                detailErrors.push(personelshiftdetailMessages.VALIDATION_ERROR.ANNUALTYPE_REQUIRED)
            }
            if (detailErrors.length > 0) {
                return next(createValidationError(detailErrors, req.language))
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
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${Uuid} numaralı personel vardiyası ${username} tarafından güncellendi.`,
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
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_FOUND], req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }

        await db.personelshiftModel.update({
            ...personelshift,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${Uuid} numaralı personel vardiyası ${username} tarafından onaylandı.`,
            pushurl: '/Personelshifts'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function CompletePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_FOUND], req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }
        if (personelshift.Isdeactive === true) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_HASDEACTIVE], req.language))
        }

        await db.personelshiftModel.update({
            ...personelshift,
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${Uuid} numaralı personel vardiyası ${username} tarafından tamamlandı.`,
            pushurl: '/Personelshifts'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function DeactivePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }
    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = await db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_FOUND], req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }
        if (personelshift.Iscompleted === true) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_HASCOMPLETED], req.language))
        }

        await db.personelshiftModel.update({
            ...personelshift,
            Isdeactive: true,
            Isworking: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await CreateNotification({
            type: types.Update,
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${Uuid} numaralı personel vardiyası ${username} tarafından iptal edildi.`,
            pushurl: '/Personelshifts'
        })

        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetPersonelshifts(req, res, next)
}

async function DeletePersonelshift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.personelshiftId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.PERSONELSHIIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_PERSONELSHIIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const personelshift = db.personelshiftModel.findOne({ where: { Uuid: Uuid } })
        if (!personelshift) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_FOUND], req.language))
        }
        if (personelshift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }

        await db.personelshiftModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await db.personelshiftdetailModel.destroy({ where: { PersonelshiftID: Uuid }, transaction: t });

        await CreateNotification({
            type: types.Delete,
            service: 'Personel Vardiyaları',
            role: 'personelshiftnotification',
            message: `${Uuid} numaralı personel vardiyası ${username} tarafından silindi.`,
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
            Startday,
            Lastday
        } = req.body

        const userConfig = {
            ProfessionID: ProfessionID
        }

        const Dateoptions = Getdateoptions(1000)
        const startDate = new Date(Startdate)
        const allshiftdefines = await db.shiftdefineModel.findAll()
        const allFloors = await DoGet(config.services.Setting, `Floors`)
        const profession = await db.professionModel.findOne({ where: { Uuid: ProfessionID } });

        const shiftdefines = allshiftdefines.filter(u => u.Isactive && !u.Isjoker).sort((a, b) => a.Priority - b.Priority)
        const jokershifts = allshiftdefines.find(u => u.Isactive && u.Isjoker)
        // vardiyalar ve joker vardiya ayrı ayrı seçildi
        const users = await DoPost(config.services.Userrole, `Users/GetUsersforshift`, userConfig)
        //meslek grubuna ait personeller bulundu

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
        //bu vardiyadan önceki 4 vardiya bulundu

        const previouspersonelshiftdetails = await db.personelshiftdetailModel.findAll({
            where: {
                PersonelshiftID: {
                    [Op.in]: previousPersonelshifts.map(personelshift => {
                        return personelshift?.Uuid
                    })
                },
                Isstartdate: true
            }
        })
        // personellere ait  4 vardiyaya shiftler bulundu

        
        // vardiya hazırlanacak personelleri bul 
        // personelleri A,B,C ve Joker olarak grupla, gruplarken önceki vardiyalarda nasıl çalıştıklarını bul 
        // hangi vardiyada çalıştığını sadece ilk gün için bul 


        res.status(200).json(users)


    } catch (error) {
        next(sequelizeErrorCatcher(error))
    }

}

module.exports = {
    GetPersonelshifts,
    GetPersonelshift,
    AddPersonelshift,
    UpdatePersonelshift,
    DeletePersonelshift,
    ApprovePersonelshift,
    CompletePersonelshift,
    DeactivePersonelshift,
    Getpeparedpersonelshift
}