const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')

async function GetShifts(req, res, next) {
    try {
        const shifts = await db.shiftModel.findAll()
        res.status(200).json(shifts)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetShift(req, res, next) {

    let validationErrors = []
    if (!req.params.shiftId) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.shiftId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const shift = await db.shiftModel.findOne({ where: { Uuid: req.params.shiftId } });
        res.status(200).json(shift)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetShiftrequests(req, res, next) {


    try {
        const shiftrequests = await db.shiftrequestModel.findAll()
        res.status(200).json(shiftrequests)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPersonelshifts(req, res, next) {
    let validationErrors = []
    if (!req.params.shiftrequestId) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(req.params.shiftrequestId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const shiftrequests = await db.personelshiftModel.findAll({ where: { ShiftrequestID: req.params.shiftrequestId } })
        res.status(200).json(shiftrequests)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddShift(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Starttime,
        Endtime,
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

    let shiftuuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.shiftModel.create({
            ...req.body,
            Uuid: shiftuuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetShifts(req, res, next)
}

async function UpdateShift(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Starttime,
        Endtime,
        Uuid,
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
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const shift = db.shiftModel.findOne({ where: { Uuid: Uuid } })
        if (!shift) {
            return next(createNotfounderror([messages.ERROR.SHIFT_NOT_FOUND], req.language))
        }
        if (shift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.SHIFT_NOT_ACTIVE], req.language))
        }

        await db.shiftModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetShifts(req, res, next)
}

async function DeleteShift(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.shiftId

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.SHIFTID_REQUIRED)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_SHIFTID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const shift = db.shiftModel.findOne({ where: { Uuid: Uuid } })
        if (!shift) {
            return next(createNotfounderror([messages.ERROR.SHIFT_NOT_FOUND], req.language))
        }
        if (shift.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.SHIFT_NOT_ACTIVE], req.language))
        }

        await db.shiftModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetShifts(req, res, next)
}

async function Addshiftperiod(req, res, next) {

    let validationErrors = []
    const {
        Startdate,
        Period,
    } = req.body

    if (!validator.isISODate(Startdate)) {
        validationErrors.push(messages.VALIDATION_ERROR.STARTDATE_REQUIRED)
    }
    if (!validator.isNumber(Period)) {
        validationErrors.push(messages.VALIDATION_ERROR.PERIOD_REQUIRED)
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    let floors = []
    try {
        const floorresponse = await axios({
            method: 'GET',
            url: config.services.Setting + `Floors`,
            headers: {
                session_key: config.session.secret
            }
        })
        floors = floorresponse.data
    } catch (error) {
        return next(requestErrorCatcher(error, 'Setting'))
    }

    let shiftrequestuuid = uuid()

    const t = await db.sequelize.transaction();
    try {

        let startdate = new Date(Startdate)
        let enddate = new Date(startdate.setDate(startdate.getDate() + (parseInt(Period) - 1)));
        await db.shiftrequestModel.create({
            ...req.body,
            Uuid: shiftrequestuuid,
            Enddate: enddate,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })


        let shifts = await db.shiftModel.findAll()
        let personels = await db.personelModel.findAll()

        if (shifts.length <= 0) {
            return next(createNotfounderror([messages.ERROR.SHIFT_NOT_FOUND], req.language))
        }
        if (floors.length <= 0) {
            return next(createNotfounderror([messages.ERROR.FLOOR_NOT_FOUND], req.language))
        }
        if (personels.length <= 0) {
            return next(createNotfounderror([messages.ERROR.PERSONEL_NOT_FOUND], req.language))
        }

        let personelcountforfloor = personels.length / floors.length;

        let filledShift = floors.map(u => { return { Uuid: u.Uuid, personels: [] } })

        personels.forEach(personel => {

            const previousFloor = personel.FloorID;
            const previousShift = personel.ShiftID;


            const passFloors = floors.filter(u => u.Uuid !== previousFloor && u.Gender === personel.Gender)
            const passShifts = shifts.filter(u => u.Uuid !== previousShift)

            let personelOk = false
            for (let passFloor of passFloors) {
                const getFloor = filledShift.find(u => u.Uuid === passFloor.Uuid)
                const getFloorcount = getFloor?.personels.length || 0
                if (getFloorcount < personelcountforfloor) {

                    let shiftCounter = 0
                    for (let passShift of passShifts.sort((a, b) => a.Priority - b.Priority)) {
                        const passShiftcount = getFloor.personels.filter(u => u.shiftUuid === passShift.Uuid).length

                        const maxShiftcounts = generateShiftSequence(getFloorcount)
                        let isShiftavaliable = false
                        if (passShiftcount < maxShiftcounts[shiftCounter]) {
                            isShiftavaliable = true
                        }
                        if (isShiftavaliable) {
                            filledShift.find(u => u.Uuid === passFloor.Uuid).personels.push({ personelUuid: personel.Uuid, shiftUuid: passShift?.Uuid })
                            personelOk = true
                            break;
                        }
                        shiftCounter++;
                    }
                }
                if (personelOk) {
                    break;
                }
            }
        });

        for (const filledData of filledShift) {
            for (const personel of filledData.personels) {
                let personelshiftuuid = uuid();
                const startDateforshift = new Date(Startdate)
                for (let index = startDateforshift.getDate(); index < parseInt(Period); index++) {
                    await db.personelshiftModel.create({
                        Uuid: personelshiftuuid,
                        ShiftrequestID: shiftrequestuuid,
                        ShiftID: personel.shiftUuid,
                        PersonelID: personel.personelUuid,
                        FloorID: filledData.Uuid,
                        Occuredday: index,
                        Createduser: "System",
                        Createtime: new Date(),
                        Isactive: true
                    }, { transaction: t })
                }
            }
        }
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    try {
        const filleddata = await db.personelshiftModel.findAll()
        res.status(200).json(filleddata)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

function generateShiftSequence(number) {
    const shiftSequence = [
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
        [2, 1, 1],
        [2, 2, 1],
        [3, 2, 1],
        [3, 2, 2],
        [3, 3, 2],
        [4, 3, 2],
        [4, 3, 3],
        [4, 4, 3],
        [5, 4, 3],
        [5, 4, 4],
        [5, 5, 4],
        [6, 5, 4],
        [6, 5, 5],
    ];
    return shiftSequence[number]
}
module.exports = {
    GetShifts,
    GetShift,
    AddShift,
    UpdateShift,
    DeleteShift,
    Addshiftperiod,
    GetShiftrequests,
    GetPersonelshifts
}