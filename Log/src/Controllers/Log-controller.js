const { sequelizeErrorCatcher } = require("../Utilities/Error")
const uuid = require('uuid').v4

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
        const logs = await db.logModel.findAll({
            attributes: [
                'UserID',
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('Createtime'), '%Y'), 'Year'],
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('Createtime'), '%m'), 'Month'],
                [Sequelize.fn('COUNT', Sequelize.col('UserID')), 'UsageCount']
            ],
            group: ['UserID', 'Year', 'Month'],
            order: [['Year', 'ASC'], ['UserID', 'ASC']]
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetProcessCount(req, res, next) {
    try {
        const logs = await db.logModel.findAll({
            attributes: [
                'UserID',
                'Requesttype',
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('Createtime'), '%Y-%m'), 'Month'],
                [Sequelize.fn('COUNT', Sequelize.col('UserID')), 'Count']
            ],
            group: ['UserID', 'Month', 'Requesttype'],
            order: [['Month', 'ASC'], ['UserID', 'ASC']]
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetServiceUsageCount(req, res, next) {
    try {
        const logs = await db.logModel.findAll({
            attributes: [
                'Service',
                'Requesttype',
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('Createtime'), '%Y-%m'), 'Month'],
                [Sequelize.fn('COUNT', Sequelize.col('Service')), 'Count']
            ],
            group: ['Service', 'Month', 'Requesttype'],
            order: [['Month', 'ASC'], ['Service', 'ASC']]
        });
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetServiceUsageCountDaily(req, res, next) {
    try {
        const logs = await db.logModel.findAll({
            attributes: [
                'Service',
                'Requesttype',
                [Sequelize.fn('DATE_FORMAT', Sequelize.col('Createtime'), '%Y-%m-%d'), 'Daily'],
                [Sequelize.fn('COUNT', Sequelize.col('Service')), 'Count']
            ],
            group: ['Service', 'Daily', 'Requesttype'],
            order: [['Daily', 'ASC'], ['Service', 'ASC']]
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