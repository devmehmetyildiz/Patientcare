const config = require("../Config")
const { types } = require("../Constants/Defines")
const messages = require("../Constants/PersonelshiftMessages")
const personelshiftdetailMessages = require("../Constants/PersonelshiftdetailMessages")
const CreateNotification = require("../Utilities/CreateNotification")
const DoPost = require("../Utilities/DoPost")
const DoGet = require("../Utilities/DoGet")
const { Getdateoptions } = require("../Utilities/Formatdate")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
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
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }

        await db.personelshiftModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.personelshiftdetailModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { PersonelshiftID: Uuid }, transaction: t })

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
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }

        await db.personelshiftModel.update({
            ...personelshift,
            Isapproved: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

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
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }
        if (personelshift.Isdeactive === true) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_HASDEACTIVE], req.language))
        }

        await db.personelshiftModel.update({
            ...personelshift,
            Iscompleted: true,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

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
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
        }
        if (personelshift.Iscompleted === true) {
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_HASCOMPLETED], req.language))
        }

        await db.personelshiftModel.update({
            ...personelshift,
            Isdeactive: true,
            Isworking: false,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

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
            return next(createNotfounderror([messages.ERROR.PERSONELSHIIFT_NOT_ACTIVE], req.language))
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
        } = req.body

        const userConfig = {
            ProfessionID: ProfessionID
        }

        const Dateoptions = Getdateoptions(1000)
        const startDate = new Date(Startdate)

        const startDay = startDate.getDate()
        const lastDay = Getshiftlastdate(startDate)

        const allshiftdefines = await db.shiftdefineModel.findAll()
        const allFloors = await DoGet(config.services.Setting, `Floors`)
        const profession = await db.professionModel.findOne({ where: { Uuid: ProfessionID } });
        const professionFloors = profession?.Floors ? (profession?.Floors || '').split(',') : []
        const shiftdefines = allshiftdefines.filter(u => u.Isactive && !u.Isjoker).sort((a, b) => a.Priority - b.Priority)
        const jokershifts = allshiftdefines.find(u => u.Isactive && u.Isjoker)
        // vardiyalar ve joker vardiya ayrı ayrı seçildi
        const users = await DoPost(config.services.Userrole, `Users/GetUsersforshift`, userConfig)
        //meslek grubuna ait personeller bulundu

        // calculation ---------------------------------------------------

        const previousPersonelshifts = await Getpreviouspersonelshifts(ProfessionID, startDate)
        //bu vardiyadan önceki 4 vardiya bulundu

        const previouspersonelshiftdetails = await db.personelshiftdetailModel.findAll({
            where: {
                PersonelshiftID: {
                    [Op.in]: previousPersonelshifts.map(personelshift => {
                        return personelshift?.Uuid
                    })
                },
                Isstartday: true
            }
        })

        let userShifts = []

        if (professionFloors.length > 0) {

            let filledPersonels = shiftdefines.map(shiftdefine => {
                return {
                    Uuid: shiftdefine.Uuid,
                    Floor: '',
                    Priority: shiftdefine.Priority,
                    Users: []
                }
            })

            for (const floorID of professionFloors) {
                const floor = allFloors.find(u => u.Uuid === floorID)
                const floorGender = floor?.Gender;

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



async function Getpreviouspersonelshifts(ProfessionID, startDate) {
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
}

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

function GetFloorforfill(floors, Filledusers) {
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
}
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
    ApprovePersonelshift,
    CompletePersonelshift,
    DeactivePersonelshift,
    Getpeparedpersonelshift
}