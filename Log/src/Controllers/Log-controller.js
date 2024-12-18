const { sequelizeErrorCatcher } = require("../Utilities/Error")
const uuid = require('uuid').v4
const validator = require("../Utilities/Validator")

async function GetLogsByQuerry(req, res, next) {
    try {
        const {
            Startdate,
            Enddate,
            Status,
            Service,
            UserID,
            Targeturl,
            Requesttype
        } = req.body

        let whereClause = {};

        if (Startdate && Enddate) {
            whereClause.Createtime = {
                [Sequelize.Op.between]: [Startdate, Enddate]
            };
        } else if (Startdate) {
            whereClause.Createtime = {
                [Sequelize.Op.gte]: Startdate
            };
        } else if (Enddate) {
            whereClause.Createtime = {
                [Sequelize.Op.lte]: Enddate
            };
        }

        if (Status) {
            whereClause.Status = Status;
        }

        if (Service) {
            whereClause.Service = Service;
        }

        if (UserID) {
            whereClause.UserID = UserID;
        }

        if (Targeturl) {
            whereClause.Targeturl = Targeturl;
        }

        if (Requesttype) {
            whereClause.Requesttype = Requesttype;
        }

        const logs = await db.logModel.findAll({
            where: whereClause,
            order: [['Createtime', 'DESC']]
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetLogs(req, res, next) {
    try {
        const logs = await db.logModel.findAll()
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddLog(req, res, next) {

    let loguuid = uuid()

    const t = await db.sequelize.transaction();

    try {
        await db.logModel.create({
            ...req.body,
            Uuid: loguuid,
            Createduser: "System",
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await t.commit()
        res.status(200).json({ res: "success" })
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }


}

async function GetUsagecountbyUserMontly(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'UserID',
                [Sequelize.fn('COUNT', Sequelize.col('UserID')), 'UsageCount']
            ],
            group: ['UserID'],
            order: [['UserID', 'ASC']],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
            },
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetProcessCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'UserID',
                'Requesttype',
                [Sequelize.fn('COUNT', Sequelize.col('UserID')), 'Count']
            ],
            group: ['UserID', 'Requesttype'],
            order: [['UserID', 'ASC']],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
            },
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetServiceUsageCount(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'Service',
                'Requesttype',
                [Sequelize.fn('COUNT', Sequelize.col('Service')), 'Count']
            ],
            group: ['Service', 'Requesttype'],
            order: [['Service', 'ASC']],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
            },
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetServiceUsageCountDaily(req, res, next) {
    try {
        let validationErrors = []
        const {
            Startdate,
            Enddate,
        } = req.query

        if (!validator.isISODate(Startdate)) {
            validationErrors.push(req.t('Logs.Error.StartdateRequired'))
        }
        if (!validator.isISODate(Enddate)) {
            validationErrors.push(req.t('Logs.Error.EnddateRequired'))
        }

        if (validationErrors.length > 0) {
            return next(createValidationError(validationErrors, req.t('Logs'), req.language))
        }

        const logs = await db.logModel.findAll({
            attributes: [
                'Service',
                'Requesttype',
                [Sequelize.fn('COUNT', Sequelize.col('Service')), 'Count']
            ],
            group: ['Service', 'Requesttype'],
            order: [['Service', 'ASC']],
            where: {
                Createtime: {
                    [Sequelize.Op.between]: [Startdate, Enddate],
                },
            },
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}



module.exports = {
    GetLogsByQuerry,
    GetLogs,
    AddLog,
    GetUsagecountbyUserMontly,
    GetProcessCount,
    GetServiceUsageCount,
    GetServiceUsageCountDaily
}