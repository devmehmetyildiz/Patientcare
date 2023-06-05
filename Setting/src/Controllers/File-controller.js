const config = require("../Config")
const messages = require("../Constants/Messages")
const { sequelizeErrorCatcher, createAccessDenied } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidation
const createNotfounderror = require("../Utilities/Error").createNotfounderror
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const fs = require('fs');
const ftp = require('basic-ftp')

async function GetFiles(req, res, next) {
    try {
        const files = await db.fileModel.findAll({ where: { Isactive: true } })
        res.status(200).json(files)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetFile(req, res, next) {

    let validationErrors = []
    if (!req.params.fileId) {
        validationErrors.push(messages.VALIDATION_ERROR.FILEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.fileId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_FILEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const file = await db.fileModel.findOne({ where: { Uuid: req.params.fileId } });
        res.status(200).json(file)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function Downloadfile(req, res, next) {

    let validationErrors = []
    if (!req.params.fileId) {
        validationErrors.push(messages.VALIDATION_ERROR.FILEID_REQUIRED)
    }
    if (!validator.isUUID(req.params.fileId)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_FILEID)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    try {
        const file = await db.fileModel.findOne({ where: { Uuid: req.params.fileId } });
        if (!file) {
            return next(createNotfounderror([messages.ERROR.FILE_NOT_FOUND], req.language))
        }
        if (file.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.FILE_NOT_ACTIVE], req.language))
        }
        const fileStream = {}
        const remoteFolderpath = `/${config.ftp.mainfolder}/${file.Filefolder}/`;
        const remoteFilePath = `/${remoteFolderpath}/${file.Filename}`;

        const server = {
            host: config.ftp.host,
            user: config.ftp.user,
            password: config.ftp.password
        };

        await (async () => {
            const client = new ftp.Client();

            try {
                await client.access(server);
                await client.downloadTo(fileStream, remoteFilePath);
                res.status(200).json(fileStream)
            } catch (err) {
                client.close();
                return next(createValidationError(messages.ERROR.FILE_UPLOAD_ERROR))
            } finally {
                client.close();
            }
        })();
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function AddFile(req, res, next) {

    let data = req.fields
    let files = req.files
    let requestArray = []
    let objKeys = Object.keys(data).map(element => {
        return element.split('.')[0]
    })

    for (const keyvalue of [...new Set(objKeys)]) {
        let object = {}
        Object.keys(data).map(element => {
            if (element.includes(keyvalue)) {
                object[element.split('.')[1]] = data[element]
            }
        })
        object['File'] = files[`${keyvalue}.File`]
        requestArray.push(object)
    }

    const t = await db.sequelize.transaction();
    try {
        for (const filedata of requestArray) {
            let fileuuid = uuid()
            filedata.Filefolder = fileuuid
            filedata.Uuid = fileuuid
            filedata.Filetype = filedata.File.type
            filedata.Filename = filedata.File.name

            const fileuploaded = await Uploadfiletoftp(filedata)
            if (!fileuploaded) {
                return next(createValidationError(messages.ERROR.FILE_UPLOAD_ERROR))
            }
            await db.fileModel.create({
                ...filedata,
                Createduser: "System",
                Createtime: new Date(),
                Isactive: true
            }, { transaction: t })
        }

        await t.commit()
    } catch (err) {
        await t.rollback()
        return next(sequelizeErrorCatcher(err))
    }
    GetFiles(req, res, next)
}

async function UpdateFile(req, res, next) {

    let validationErrors = []
    let requestObject = req.fields
    requestObject.File = req.files.file

    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const file = db.fileModel.findOne({ where: { Uuid: requestObject.Uuid } })
        if (!file) {
            return next(createNotfounderror([messages.ERROR.FILE_NOT_FOUND], req.language))
        }
        if (file.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.FILE_NOT_ACTIVE], req.language))
        }

        const isFileremoved = await Removefileandfolderfromftp(requestObject)
        if (!isFileremoved) {
            return next(createValidationError(messages.ERROR.FILE_UPLOAD_ERROR))
        }
        await Uploadfiletoftp(requestObject)
        await db.fileModel.update({
            ...req.body,
            Updateduser: "System",
            Updatetime: new Date(),
        }, { where: { Uuid: requestObject.Uuid } }, { transaction: t })

        await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetFiles(req, res, next)
}

async function DeleteFile(req, res, next) {

    let validationErrors = []
    const {
        Uuid
    } = req.body

    if (!Uuid) {
        validationErrors.push(messages.VALIDATION_ERROR.FILEID_REQUIRED, req.language)
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_FILEID, req.language)
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.language))
    }

    const t = await db.sequelize.transaction();
    try {
        const file = await db.fileModel.findOne({ where: { Uuid: req.params.fileId } });
        if (!file) {
            return next(createNotfounderror([messages.ERROR.FILE_NOT_FOUND], req.language))
        }
        if (file.Isactive === false) {
            return next(createAccessDenied([messages.ERROR.FILE_NOT_ACTIVE], req.language))
        }
        const isremoved = await Removefileandfolderfromftp(file)
        if (!isremoved) {
            return next(createValidationError(messages.ERROR.FILE_UPLOAD_ERROR))
        }
        await db.fileModel.destroy({ where: { Uuid: Uuid }, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetFiles(req, res, next)
}

async function Uploadfiletoftp(fileObject) {
    let isuploaded = false
    if (!fileObject.File) {
        return false
    }

    const ishavefolder = await Checkdirectoryfromftp(fileObject.Filefolder)
    if (!ishavefolder) {
        return false
    }
    const fileStream = fs.createReadStream(fileObject.File.path);
    const remoteFolderpath = `/${config.ftp.mainfolder}/${fileObject.Filefolder}/`;
    const remoteFilePath = `/${remoteFolderpath}/${fileObject.File.name}`;

    const server = {
        host: config.ftp.host,
        user: config.ftp.user,
        password: config.ftp.password
    };

    await (async () => {
        const client = new ftp.Client();

        try {
            await client.access(server);
            await client.uploadFrom(fileStream, remoteFilePath);
            isuploaded = true
        } catch (err) {
            isuploaded = false
        } finally {
            client.close();
        }
    })();
    return isuploaded
}

async function Checkdirectoryfromftp(directoryname) {
    let isdirectoryactive = false

    const remoteFolderpath = `/${config.ftp.mainfolder}/${directoryname}/`;
    const server = {
        host: config.ftp.host,
        user: config.ftp.user,
        password: config.ftp.password
    };

    await (async () => {
        const client = new ftp.Client();

        try {
            await client.access(server);

            const dirList = await client.list(`/${config.ftp.mainfolder}/`);
            const directoryExists = dirList.some((item) => item.name === directoryname);

            if (!directoryExists) {
                await client.ensureDir(remoteFolderpath); // Use "true" to create nested directories if needed
                isdirectoryactive = true
            } else {
                isdirectoryactive = false
            }
        } catch (err) {
            isdirectoryactive = false
        } finally {
            client.close();
        }
    })();
    return isdirectoryactive
}

async function Removefileandfolderfromftp(fileObject) {
    let isremoved = false

    const ishavefolder = await Checkdirectoryfromftp(fileObject.Filefolder)
    if (ishavefolder) {
        const remoteFolderpath = `/${config.ftp.mainfolder}/${fileObject.Filefolder}/`;
        const remoteFilePath = `/${remoteFolderpath}/${fileObject.Filename}`;

        const server = {
            host: config.ftp.host,
            user: config.ftp.user,
            password: config.ftp.password
        };

        await (async () => {
            const client = new ftp.Client();

            try {
                await client.access(server);
                await client.removeDir(remoteFolderpath, remoteFilePath);
                isremoved = true
            } catch (err) {
                isremoved = false
            } finally {
                client.close();
            }
        })();
    }
    return isremoved
}


module.exports = {
    GetFiles,
    GetFile,
    AddFile,
    UpdateFile,
    DeleteFile,
    Downloadfile,
}