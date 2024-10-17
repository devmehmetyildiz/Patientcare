const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const jobs = require('../Jobs')
const CreateNotification = require("../Utilities/CreateNotification")
const { types } = require("../Constants/Defines")

async function GetRules(req, res, next) {
    try {
        const rules = await db.ruleModel.findAll()
        res.status(200).json(rules)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetRulelogs(req, res, next) {

    let validationErrors = []
    if (!req.params.ruleId) {
        validationErrors.push(req.t('Rules.Error.RuleIDRequired'))
    }
    if (!validator.isUUID(req.params.ruleId)) {
        validationErrors.push(req.t('Rules.Error.UnsupportedRuleID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rules'), req.language))
    }

    try {
        const rulelogs = await db.rulelogModel.findAll({
            where: { RuleID: req.params.ruleId }, order: [
                ['Id', 'DESC']],
        });
        if (!rulelogs) {
            return next(createNotFoundError(req.t('Rules.Error.RulelogNotFound'), req.t('Rules'), req.language))
        }
        res.status(200).json(rulelogs)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function ClearRulelogs(req, res, next) {

    let validationErrors = []
    if (!req.params.ruleId) {
        validationErrors.push(req.t('Rules.Error.RuleIDRequired'))
    }
    if (!validator.isUUID(req.params.ruleId)) {
        validationErrors.push(req.t('Rules.Error.UnsupportedRuleID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rules'), req.language))
    }
    const t = await db.sequelize.transaction();
    try {
        await db.rulelogModel.destroy({ where: { RuleID: req.params.ruleId }, transaction: t });
        await t.commit()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetRulelogs(req, res, next)
}

async function GetRule(req, res, next) {

    let validationErrors = []
    if (!req.params.ruleId) {
        validationErrors.push(req.t('Rules.Error.RuleIDRequired'))
    }
    if (!validator.isUUID(req.params.ruleId)) {
        validationErrors.push(req.t('Rules.Error.UnsupportedRuleID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rules'), req.language))
    }

    try {
        const rule = await db.ruleModel.findOne({ where: { Uuid: req.params.ruleId } });
        if (!rule) {
            return next(createNotFoundError(req.t('Rules.Error.NotFound'), req.t('Rules'), req.language))
        }
        if (!rule.Isactive) {
            return next(createNotFoundError(req.t('Rules.Error.NotActive'), req.t('Rules'), req.language))
        }
        res.status(200).json(rule)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddRule(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Rule,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Rules.Error.NameRequired'))
    }
    if (!validator.isString(Rule)) {
        validationErrors.push(req.t('Rules.Error.RuleRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rules'), req.language))
    }

    let ruleuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.ruleModel.create({
            ...req.body,
            Uuid: ruleuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        await CreateNotification({
            type: types.Create,
            service: req.t('Rules'),
            role: 'rulenotification',
            message: {
                tr: `${Name} Kural ${username} tarafından Oluşturuldu.`,
                en: `${Name} Rule Created by ${username}`
            }[req.language],
            pushurl: '/Rules'
        })

        await t.commit()

        await jobs.CroneJobs()

    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetRules(req, res, next)
}

async function UpdateRule(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Rule,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Rules.Error.NameRequired'))
    }
    if (!validator.isString(Rule)) {
        validationErrors.push(req.t('Rules.Error.RuleRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Rules.Error.RuleIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Rules.Error.UnsupportedRuleID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rules'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const rule = await db.ruleModel.findOne({ where: { Uuid: Uuid } })
        if (!rule) {
            return next(createNotFoundError(req.t('Rules.Error.NotFound'), req.t('Rules'), req.language))
        }
        if (!rule.Isactive) {
            return next(createNotFoundError(req.t('Rules.Error.NotActive'), req.t('Rules'), req.language))
        }
        await jobs.stopChildProcess(Uuid)

        await db.ruleModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Rules'),
            role: 'rulenotification',
            message: {
                tr: `${Name} Kural ${username} tarafından Güncellendi.`,
                en: `${Name} Rule Updated by ${username}`
            }[req.language],
            pushurl: '/Rules'
        })

        await t.commit()

        await jobs.CroneJobs()
    } catch (error) {
        await t.rollback()
        return next(sequelizeErrorCatcher(error))
    }
    GetRules(req, res, next)
}

async function DeleteRule(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.ruleId

    if (!Uuid) {
        validationErrors.push(req.t('Rules.Error.RuleIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Rules.Error.UnsupportedRuleID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rules'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const rule = await db.ruleModel.findOne({ where: { Uuid: Uuid } })
        if (!rule) {
            return next(createNotFoundError(req.t('Rules.Error.NotFound'), req.t('Rules'), req.language))
        }
        if (!rule.Isactive) {
            return next(createNotFoundError(req.t('Rules.Error.NotActive'), req.t('Rules'), req.language))
        }

        await db.ruleModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Rules'),
            role: 'rulenotification',
            message: {
                tr: `${rule?.Name} Kural ${username} tarafından Silindi.`,
                en: `${rule?.Name} Rule Deleted by ${username}`
            }[req.language],
            pushurl: '/Rules'
        })

        await t.commit();
        await jobs.stopChildProcess(Uuid)
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetRules(req, res, next)
}

async function StopRule(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.ruleId

    if (!Uuid) {
        validationErrors.push(req.t('Rules.Error.RuleIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Rules.Error.UnsupportedRuleID'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Rules'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const rule = await db.ruleModel.findOne({ where: { Uuid: Uuid } })
        if (!rule) {
            return next(createNotFoundError(req.t('Rules.Error.NotFound'), req.t('Rules'), req.language))
        }
        if (!rule.Isactive) {
            return next(createNotFoundError(req.t('Rules.Error.NotActive'), req.t('Rules'), req.language))
        }

        await db.ruleModel.update({
            ...req.body,
            Status: 0,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Update,
            service: req.t('Rules'),
            role: 'rulenotification',
            message: {
                tr: `${rule?.Name} Kural ${username} tarafından Durduruldu.`,
                en: `${rule?.Name} Rule Stopped by ${username}`
            }[req.language],
            pushurl: '/Rules'
        })

        await t.commit();
        await jobs.stopChildProcess(Uuid)
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetRules(req, res, next)
}

module.exports = {
    GetRules,
    GetRule,
    AddRule,
    UpdateRule,
    DeleteRule,
    GetRulelogs,
    ClearRulelogs,
    StopRule
}

