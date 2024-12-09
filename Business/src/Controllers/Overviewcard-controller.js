const config = require("../Config")
const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const DoGet = require("../Utilities/DoGet")
const DoPost = require("../Utilities/DoPost")
const { sequelizeErrorCatcher, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const axios = require('axios')
const { patientmovementtypes } = require('../Constants/Patientmovementypes')
const DoDelete = require("../Utilities/DoDelete")
const DoPut = require("../Utilities/DoPut")

async function GetTrainingCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
            Traningtype
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }
        if (!validator.isNumber(Traningtype)) {
            validationErrors.push(req.t('Overviewcards.Error.TraningtypeRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const trainings = await db.trainingModel.findAll({
            where: {
                Trainingdate: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
                Typedetail: Traningtype,
                Iscompleted: true,
                Isapproved: true,
                Isonpreview: false,
                Isactive: true,
            },
        });

        let resArr = []

        for (const training of trainings) {
            const rawTrainingDate = new Date(training?.Trainingdate)
            rawTrainingDate.setDate(1)
            const trainingDate = rawTrainingDate.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === trainingDate)
            const trainingUsercount = await db.trainingusersModel.count({
                where: {
                    TrainingID: training?.Uuid,
                    Iscompleted: true,
                    Isactive: true
                },
            });
            if (trainingUsercount > 0) {
                if (isArrayHaveDate) {
                    const old = resArr.find(item => item.key === trainingDate)
                    resArr = [
                        ...resArr.filter(u => u.key !== trainingDate),
                        {
                            key: trainingDate,
                            value: trainingUsercount + old?.value || 0
                        }
                    ]
                } else {
                    resArr.push({
                        key: trainingDate,
                        value: trainingUsercount
                    })
                }
            }
        }

        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetUserincidentCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const incidents = await db.userincidentModel.findAll({
            where: {
                Occuredtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
                Iscompleted: true,
                Isapproved: true,
                Isonpreview: false,
                Isactive: true,
            },
        });

        let resArr = []

        for (const incident of incidents) {
            const rawOccuredtime = new Date(incident?.Occuredtime)
            rawOccuredtime.setDate(1)
            const incidentOccuredtime = rawOccuredtime.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === incidentOccuredtime)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === incidentOccuredtime)
                resArr = [
                    ...resArr.filter(u => u.key !== incidentOccuredtime),
                    {
                        key: incidentOccuredtime,
                        value: 1 + old?.value || 0
                    }
                ]
            } else {
                resArr.push({
                    key: incidentOccuredtime,
                    value: 1
                })
            }
        }

        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetPatientvisitCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.body

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Overviewcards.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Overviewcards.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Overviewcards'), req.language))
        }

        const visits = await db.patientvisitModel.findAll({
            where: {
                Starttime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
                Iscompleted: true,
                Isapproved: true,
                Isonpreview: false,
                Isactive: true,
            },
        });

        let resArr = []

        for (const visit of visits) {
            const rawStartdate = new Date(visit?.Starttime)
            rawStartdate.setDate(1)
            const visitStartDate = rawStartdate.toLocaleDateString('tr')

            const isArrayHaveDate = resArr.some(item => item.key === visitStartDate)

            if (isArrayHaveDate) {
                const old = resArr.find(item => item.key === visitStartDate)
                resArr = [
                    ...resArr.filter(u => u.key !== visitStartDate),
                    {
                        key: visitStartDate,
                        value: 1 + old?.value || 0
                    }
                ]
            } else {
                resArr.push({
                    key: visitStartDate,
                    value: 1
                })
            }
        }

        res.json(resArr)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}



module.exports = {
    GetTrainingCount,
    GetPatientvisitCount,
    GetUserincidentCount
}