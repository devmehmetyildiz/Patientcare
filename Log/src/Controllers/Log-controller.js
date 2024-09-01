const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied, requestErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const validator = require("../Utilities/Validator")
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
        const logs = await db.logModel.findAll({ where: { Isactive: true } })
        res.status(200).json(logs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddLog(req, res, next) {

    let validationErrors = []

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

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
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
}

module.exports = {
    GetLogsByQuerry,
    GetLogs,
    AddLog
}