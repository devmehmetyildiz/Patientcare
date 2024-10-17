const config = require("../Config")
const { sequelizeErrorCatcher } = require("../Utilities/Error")
const createValidationError = require("../Utilities/Error").createValidationError
const createNotFoundError = require("../Utilities/Error").createNotFoundError
const validator = require("../Utilities/Validator")
const uuid = require('uuid').v4
const fs = require('fs');
const stream = require("stream");
const SftpClient = require('ssh2-sftp-client');

async function GetFiles(req, res, next) {
    try {
        const files = await db.fileModel.findAll()
        res.status(200).json(files)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetbyparentID(req, res, next) {

    let validationErrors = []
    if (!req.params.parentId) {
        validationErrors.push(req.t('Files.Error.ParentIDRequired'))
    }
    if (!validator.isUUID(req.params.parentId)) {
        validationErrors.push(req.t('Files.Error.UnsupportedParentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Files'), req.language))
    }

    try {
        const files = await db.fileModel.findAll({ where: { ParentID: req.params.parentId } });
        res.status(200).json(files)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetbyorderfileID(req, res, next) {

    let validationErrors = []
    if (!req.params.orderfileId) {
        validationErrors.push(req.t('Files.Error.ParentIDRequired'))
    }
    if (!validator.isUUID(req.params.orderfileId)) {
        validationErrors.push(req.t('Files.Error.UnsupportedParentID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Files'), req.language))
    }

    try {
        const files = await db.fileModel.findAll({ where: { ParentID: req.params.orderfileId } });
        res.status(200).json(files)
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
}

async function GetFile(req, res, next) {

    let validationErrors = []
    if (!req.params.fileId) {
        validationErrors.push(req.t('Files.Error.FileIDRequired'))
    }
    if (!validator.isUUID(req.params.fileId)) {
        validationErrors.push(req.t('Files.Error.UnsupportedFileID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Files'), req.language))
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
        validationErrors.push(req.t('Files.Error.FileIDRequired'))
    }
    if (!validator.isUUID(req.params.fileId)) {
        validationErrors.push(req.t('Files.Error.UnsupportedFileID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Files'), req.language))
    }

    try {
        const file = await db.fileModel.findOne({ where: { Uuid: req.params.fileId } });
        if (!file) {
            return next(createNotFoundError(req.t('Files.Error.NotFound'), req.t('Files'), req.language))
        }
        if (file.Isactive === false) {
            return next(createNotFoundError(req.t('Files.Error.NotActive'), req.t('Files'), req.language))
        }
        const encodedFileName = encodeURIComponent(file.Filename);
        res.setHeader("Content-Disposition", `attachment; filename="${encodedFileName}"`);
        res.setHeader("Content-Type", file.Filetype);
        const fileStream = new stream.Writable({
            write(chunk, encoding, callback) {
                if (res.writableEnded) {
                    return callback(new Error('Response ended'));
                }
                res.write(chunk, encoding, callback);
            },
            final(callback) {
                res.end(callback);
            },
        });
        const remoteFolderpath = `${config.ftp.mainfolder}/${file.Filefolder}`;
        const remoteFilePath = `/${remoteFolderpath}/${file.Filename}`;

        await (async () => {
            try {
                const client = new SftpClient();
                await client.connect({
                    host: config.ftp.host,
                    port: 22,
                    username: config.ftp.user,
                    password: config.ftp.password
                });

                await client.get(remoteFilePath, fileStream);

                fileStream.on('finish', () => {
                    console.log('File downloaded and sent as response successfully');
                });

            } catch (err) {
                console.log('err: ', err);
                return next(createValidationError(req.t('Files.Error.Downloaderror'), req.t('Files'), req.language))
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
                return next(createValidationError(req.t('Files.Error.Uploaderror'), req.t('Files'), req.language))
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

    //  const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {

        for (const filedata of requestArray) {

            if (!validator.isUUID(filedata.Uuid)) {
                let fileuuid = uuid()
                filedata.Filefolder = fileuuid
                filedata.Uuid = fileuuid
                filedata.Filetype = filedata.File.type
                filedata.Filename = filedata.File.name

                const fileuploaded = await Uploadfiletoftp(filedata)
                if (!fileuploaded) {
                    return next(createValidationError(req.t('Files.Error.Uploaderror'), req.t('Files'), req.language))
                }
                await db.fileModel.create({
                    ...filedata,
                    Createduser: username,
                    Createtime: new Date(),
                    Isactive: true
                })
            } else {

                const file = await db.fileModel.findOne({ where: { Uuid: filedata.Uuid } })
                if (!file) {
                    return next(createNotFoundError(req.t('Files.Error.NotFound'), req.t('Files'), req.language))
                }
                if (file.Isactive === false) {
                    return next(createNotFoundError(req.t('Files.Error.NotActive'), req.t('Files'), req.language))
                }
                if (filedata.WillDelete) {
                    await db.fileModel.update({
                        Deleteduser: username,
                        Deletetime: new Date(),
                        Isactive: false
                    }, { where: { Uuid: filedata.Uuid } })
                } else {
                    if (filedata.fileChanged) {
                        await db.fileModel.update({
                            ...filedata,
                            Deleteduser: username,
                            Deletetime: new Date(),
                        }, { where: { Uuid: filedata.Uuid } })
                        let newfileuuid = uuid()
                        filedata.Filefolder = newfileuuid
                        filedata.Uuid = newfileuuid
                        filedata.Filetype = filedata.File.type
                        filedata.Filename = filedata.File.name
                        const fileuploaded = await Uploadfiletoftp(filedata)
                        if (!fileuploaded) {
                            return next(createValidationError(req.t('Files.Error.Uploaderror'), req.t('Files'), req.language))
                        }
                        await db.fileModel.create({
                            ...filedata,
                            Createduser: username,
                            Createtime: new Date(),
                            Isactive: true
                        })

                    } else {
                        delete filedata.Id
                        await db.fileModel.update({
                            ...filedata,
                            Updateduser: username,
                            Updatetime: new Date(),
                        }, { where: { Uuid: filedata.Uuid } })
                    }
                }
            }
        }
        // await t.commit()
    } catch (error) {
        return next(sequelizeErrorCatcher(error))
    }
    GetFiles(req, res, next)
}

async function DeleteFile(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.fileId

    if (!Uuid) {
        validationErrors.push(req.t('Files.Error.FileIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Files.Error.UnsupportedFileID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Files'), req.language))
    }

    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'

    try {
        const file = await db.fileModel.findOne({ where: { Uuid: req.params.fileId } });
        if (!file) {
            return next(createNotFoundError(req.t('Files.Error.NotFound'), req.t('Files'), req.language))
        }
        if (file.Isactive === false) {
            return next(createNotFoundError(req.t('Files.Error.NotActive'), req.t('Files'), req.language))
        }

        await db.fileModel.update({
            Deleteduser: username,
            Deletetime: new Date(),
        }, { where: { Uuid: Uuid }, transaction: t })
        await t.commit();
    } catch (error) {
        await t.rollback();
        return next(sequelizeErrorCatcher(error))
    }
    GetFiles(req, res, next)
}

async function DeleteFileByParentID(req, res, next) {

    let validationErrors = []
    const Uuid = req.params.parentID

    if (!Uuid) {
        validationErrors.push(req.t('Files.Error.FileIDRequired'))
    }
    if (!validator.isUUID(Uuid)) {
        validationErrors.push(req.t('Files.Error.UnsupportedFileID'))
    }
    if (validationErrors.length > 0) {
        return next(createValidationError(validationErrors, req.t('Files'), req.language))
    }


    const t = await db.sequelize.transaction();
    const username = req?.identity?.user?.Username || 'System'
    try {
        const files = await db.fileModel.findAll({ where: { ParentID: Uuid } });
        if ((files || []).length > 0) {
            for (const file of files) {
                await db.fileModel.update({
                    Deleteduser: username,
                    Deletetime: new Date(),
                    Isactive: false
                }, { where: { Uuid: file?.Uuid } }, { transaction: t })
            }
        }
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

    const remoteFolderpath = `${config.ftp.mainfolder}/${fileObject.Filefolder}`;
    const remoteFilePath = `/${remoteFolderpath}/${fileObject.File.name}`;

    await (async () => {
        try {
            const client = new SftpClient();
            await client.connect({
                host: config.ftp.host,
                port: 22,
                username: config.ftp.user,
                password: config.ftp.password
            });
            await client.put(fileStream, remoteFilePath);
            isuploaded = true
        } catch (err) {
            console.log('err: ', err);
            isuploaded = false
        }
    })();
    return isuploaded
}

async function Checkdirectoryfromftp(directoryname) {
    let isdirectoryactive = false;
    const remoteFolderpath = `/${config.ftp.mainfolder}/${directoryname}/`;

    const client = new SftpClient();
    try {
        await client.connect({
            host: config.ftp.host,
            port: 22,
            username: config.ftp.user,
            password: config.ftp.password
        });

        const dirList = await client.list(`/${config.ftp.mainfolder}/`);

        const directoryExists = dirList.some((item) => item.name === directoryname);

        if (!directoryExists) {
            await client.mkdir(remoteFolderpath, true);
        }

        isdirectoryactive = true;
    } catch (err) {
        console.log('Error checking/creating directory: ', err);
        isdirectoryactive = false;
    } finally {
        await client.end();
    }

    return isdirectoryactive;
}

module.exports = {
    GetFiles,
    GetFile,
    AddFile,
    UpdateFile,
    DeleteFile,
    Downloadfile,
    GetbyparentID,
    GetbyorderfileID,
    DeleteFileByParentID
}