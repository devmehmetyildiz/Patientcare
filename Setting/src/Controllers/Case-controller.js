const { types } = require("../Constants/Defines")
const CreateNotification = require("../Utilities/CreateNotification")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4


async function GetCases(req, res, next) {
    try {
        const cases = await db.caseModel.findAll()
        for (const casedata of cases) {
            casedata.Departmentuuids = await db.casedepartmentModel.findAll({
                where: {
                    CaseID: casedata.Uuid,
                },
                attributes: ['DepartmentID']
            });
        }
        res.status(200).json(cases)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCompleteCase(req, res, next) {

    try {
        const casedata = await db.caseModel.findOne({ where: { CaseStatus: 1 } });
        if (!casedata) {
            return next(createNotFoundError(req.t('Cases.Error.NotFound'), req.t('Careplanparameters'), req.language))
        }
        if (!casedata.Isactive) {
            return next(createNotFoundError(req.t('Cases.Error.NotActive'), req.t('Careplanparameters'), req.language))
        }
        casedata.Departmentuuids = await db.casedepartmentModel.findAll({
            where: {
                CaseID: casedata.Uuid,
            },
            attributes: ['DepartmentID']
        });
        res.status(200).json(casedata)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetDeactivateCase(req, res, next) {

    try {
        const casedata = await db.caseModel.findOne({ where: { CaseStatus: -1 } });
        if (!casedata) {
            return next(createNotFoundError(req.t('Cases.Error.NotFound'), req.t('Careplanparameters'), req.language))
        }
        if (!casedata.Isactive) {
            return next(createNotFoundError(req.t('Cases.Error.NotActive'), req.t('Careplanparameters'), req.language))
        }
        casedata.Departmentuuids = await db.casedepartmentModel.findAll({
            where: {
                CaseID: casedata.Uuid,
            },
            attributes: ['DepartmentID']
        });
        res.status(200).json(casedata)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetCase(req, res, next) {

    let validationErrors = []
    if (!req.params.caseId) {
        validationErrors.push(req.t('Cases.Error.CaseIDRequired'))
    }
    if (!validator.isUUID(req.params.caseId)) {
        validationErrors.push(req.t('Cases.Error.UnsupportedCaseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Cases'), req.language))
    }

    try {
        const casedata = await db.caseModel.findOne({ where: { Uuid: req.params.caseId } });
        if (!casedata) {
            return next(createNotFoundError(req.t('Cases.Error.NotFound'), req.t('Careplanparameters'), req.language))
        }
        if (!casedata.Isactive) {
            return next(createNotFoundError(req.t('Cases.Error.NotActive'), req.t('Careplanparameters'), req.language))
        }
        casedata.Departmentuuids = await db.casedepartmentModel.findAll({
            where: {
                CaseID: casedata.Uuid,
            },
            attributes: ['DepartmentID']
        });
        res.status(200).json(casedata)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}



async function AddCase(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Shortname,
        Casecolor,
        CaseStatus,
        Departments,
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Cases.Error.NameRequired'))
    }
    if (!validator.isString(Shortname)) {
        validationErrors.push(req.t('Cases.Error.ShortnameRequired'))
    }
    if (!validator.isString(Casecolor)) {
        validationErrors.push(req.t('Cases.Error.CasecolorRequired'))
    }
    if (!validator.isNumber(CaseStatus)) {
        validationErrors.push(req.t('Cases.Error.CasestatusRequired'))
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(req.t('Cases.Error.DepartmentsRequired'))
    }

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Cases'), req.language))
    }

    let caseuuid = uuid()

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        await db.caseModel.create({
            ...req.body,
            Uuid: caseuuid,
            Createduser: username,
            Createtime: new Date(),
            Isactive: true
        }, { transaction: t })

        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(req.t('Cases.Error.UnsupportedDepartmentID'), req.t('Cases'), req.language))
            }
            await db.casedepartmentModel.create({
                CaseID: caseuuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Create,
            service: req.t('Cases'),
            role: 'casenotification',
            message: {
                tr: `${Name} durumu ${username} tarafından Oluşturuldu.`,
                en: `${Name} case created by ${username}.`
            }[req.language],
            pushurl: '/Cases'
        })
        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetCases(req, res, next)
}

async function UpdateCase(req, res, next) {

    let validationErrors = []
    const {
        Name,
        Shortname,
        Casecolor,
        CaseStatus,
        Departments,
        Uuid
    } = req.body

    if (!validator.isString(Name)) {
        validationErrors.push(req.t('Cases.Error.NameRequired'))
    }
    if (!validator.isString(Shortname)) {
        validationErrors.push(req.t('Cases.Error.ShortnameRequired'))
    }
    if (!Uuid) {
        validationErrors.push(req.t('Cases.Error.CaseIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Cases.Error.UnsupportedCaseID'))
    }
    if (!validator.isString(Casecolor)) {
        validationErrors.push(req.t('Cases.Error.CasecolorRequired'))
    }
    if (!validator.isNumber(CaseStatus)) {
        validationErrors.push(req.t('Cases.Error.CasestatusRequired'))
    }
    if (!validator.isArray(Departments)) {
        validationErrors.push(req.t('Cases.Error.DepartmentsRequired'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const casedata = await db.caseModel.findOne({ where: { Uuid: Uuid } })
        if (!casedata) {
            return next(createNotFoundError(req.t('Cases.Error.NotFound'), req.t('Cases'), req.language))
        }
        if (casedata.Isactive === false) {
            return next(createNotFoundError(req.t('Cases.Error.NotActive'), req.t('Cases'), req.language))
        }

        await db.caseModel.update({
            ...req.body,
            Updateduser: username,
            Updatetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })

        await db.casedepartmentModel.destroy({ where: { CaseID: Uuid }, transaction: t });
        for (const department of Departments) {
            if (!department.Uuid || !validator.isUUID(department.Uuid)) {
                return next(createValidationError(req.t('Cases.Error.UnsupportedDepartmentID'), req.t('Cases'), req.language))
            }
            await db.casedepartmentModel.create({
                CaseID: Uuid,
                DepartmentID: department.Uuid
            }, { transaction: t });
        }

        await CreateNotification({
            type: types.Update,
            service: req.t('Cases'),
            role: 'casenotification',
            message: {
                tr: `${Name} durumu ${username} tarafından Güncellendi.`,
                en: `${Name} case updated by ${username}.`
            }[req.language],
            pushurl: '/Cases'
        })
        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetCases(req, res, next)
}

async function DeleteCase(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.caseId

    if (!Uuid) {
        validationErrors.push(req.t('Cases.Error.CaseIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Cases.Error.UnsupportedCaseID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const casedata = await db.caseModel.findOne({ where: { Uuid: Uuid } })
        if (!casedata) {
            return next(createNotFoundError(req.t('Cases.Error.NotFound'), req.t('Cases'), req.language))
        }
        if (casedata.Isactive === false) {
            return next(createNotFoundError(req.t('Cases.Error.NotActive'), req.t('Cases'), req.language))
        }

        await db.caseModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
            Isactive: false
        }, { where: { Uuid: Uuid }, transaction: t })

        await CreateNotification({
            type: types.Delete,
            service: req.t('Cases'),
            role: 'casenotification',
            message: {
                tr: `${casedata?.Name} Durumu ${username} tarafından Silindi.`,
                en: `${casedata?.Name} Case Deleted by ${username}.`
            }[req.language],
            pushurl: '/Cases'
        })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetCases(req, res, next)
}

module.exports = {
    GetCases,
    GetCase,
    AddCase,
    UpdateCase,
    DeleteCase,
    GetCompleteCase,
    GetDeactivateCase
}
