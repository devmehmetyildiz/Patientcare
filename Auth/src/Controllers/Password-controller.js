const messages = require('../Constants/Messages')
const createValidationError = require('../Utilities/Error').createValidation
const bcrypt = require('bcrypt')
const uuid = require('uuid').v4
const { sequelizeErrorCatcher, createAccessDenied, createAutherror, requestErrorCatcher, createNotfounderror } = require("../Utilities/Error")
const axios = require('axios')
const config = require('../Config')
const validator = require('../Utilities/Validator')
const nodemailer = require('nodemailer');
const { Createresettemplate } = require('../Utilities/Htmltemplates')

async function Createrequest(req, res, next) {
  let validationErrors = []
  if (!req.params.email) {
    validationErrors.push(messages.VALIDATION_ERROR.EMAIL_REQUIRED)
  }
  if (validationErrors.length > 0) {
    return next(createValidationError(validationErrors, req.language))
  }

  try {
    let user = null
    let emailsetting = null
    try {
      const userresponse = await axios({
        method: 'GET',
        url: config.services.Userrole + 'Users/Getbyemail/' + req.params.email,
        headers: {
          session_key: config.session.secret
        }
      })
      user = userresponse.data
    } catch (error) {
      return next(requestErrorCatcher(error, 'Userrole'))
    }

    try {
      const emailresponse = await axios({
        method: 'GET',
        url: config.services.System + 'Mailsettings/GetActiveMailsetting',
        headers: {
          session_key: config.session.secret
        }
      })
      emailsetting = emailresponse.data
    } catch (error) {
      return next(requestErrorCatcher(error, 'System'))
    }

    let requestUuid = uuid()
    let passwordresetrequest = {
      Uuid: requestUuid,
      UserID: user.Uuid,
      Emailsended: false,
      Reseturl: config.services.Auth + 'Password/Validateresetrequest/' + requestUuid,
      Emailconfirmed: false,
      Newpassword: null,
      Oldpassword: null,
      Userfetchedcount: 0,
      Createduser: 'System',
      Createtime: new Date(),
      Isactive: true
    }

    const transporter = nodemailer.createTransport({
      host: emailsetting.Smtphost,
      port: emailsetting.Smtpport,
      auth: {
        user: emailsetting.Mailaddress,
        pass: emailsetting.Password,
      },
    });

    await transporter.verify()

    await transporter.sendMail({
      from: emailsetting.Mailaddress, // sender address
      to: user.Email, // list of receivers
      subject: "Star Note Parola Sıfırlama Talebiniz Alınmıştır", // Subject line
      text: "Bu mesaj uygulama tarafından gönderilmiştir", // plain text body
      html: Createresettemplate(user.Username, passwordresetrequest.Reseturl),
    })

    await db.passwordrefreshrequestModel.create(passwordresetrequest)

    res.status(200).json({ message: "success" })
  } catch (error) {
    return next(sequelizeErrorCatcher(error))
  }
}

async function Getrequestbyuser(req, res, next) {

  let validationErrors = []
  if (req.params.requestId === undefined) {
    validationErrors.push(messages.VALIDATION_ERROR.USERID_REQUIRED)
  }
  if (!validator.isUUID(req.params.requestId)) {
    validationErrors.push(messages.VALIDATION_ERROR.UNSUPPORTED_USERID)
  }
  if (validationErrors.length > 0) {
    return next(createValidationError(validationErrors, req.language))
  }
  try {
    const request = await db.passwordrefreshrequestModel.findOne({ where: { Uuid: req.params.requestId } })
    if (!request) {
      return next(createNotfounderror([messages.ERROR.REQUEST_NOT_FOUND], req.language))
    }
    if (!request.Isactive) {
      return next(createNotfounderror([messages.ERROR.REQUEST_NOT_ACTIVE], req.language))
    }

    if (request.Userfetchedcount > 1) {
      return next(createAutherror([messages.ERROR.RESET_REQUEST_REJECTED], req.language))
    }

    const Datenow = new Date(request.Createtime);
    Datenow.setDate(Datenow.getDate() + 1);

    if (request.Createtime > Datenow) {
      return next(createAutherror([messages.ERROR.RESET_REQUEST_ENDED], req.language))
    }

    await db.passwordrefreshrequestModel.update({
      ...request,
      Userfetchedcount: request.Userfetchedcount + 1,
      Updateduser: 'System',
      Updatetime: new Date()
    }, { where: { Uuid: request.Uuid } })

    try {
      const userresponse = await axios({
        method: 'GET',
        url: config.services.Userrole + `Users/${request.UserID}`,
        headers: {
          session_key: config.session.secret
        }
      })
      const user = userresponse.data
      user.PasswordHash && delete user.PasswordHash
      res.status(200).json(user)
    } catch (error) {
      next(requestErrorCatcher(error, 'Userrole'))
    }
  } catch (error) {
    next(sequelizeErrorCatcher(error))
  }
}


async function Validateresetrequest(req, res, next) {
  let validationErrors = []
  if (!req.params.requestId) {
    validationErrors.push(messages.VALIDATION_ERROR.REQUESTID_REQUIRED)
  }
  if (validationErrors.length > 0) {
    return next(createValidationError(validationErrors, req.language))
  }

  try {
    const request = await db.passwordrefreshrequestModel.findOne({ where: { Uuid: req.params.requestId } })
    if (!request) {
      return next(createNotfounderror([messages.ERROR.REQUEST_NOT_FOUND], req.language))
    }
    if (!request.Isactive) {
      return next(createNotfounderror([messages.ERROR.REQUEST_NOT_ACTIVE], req.language))
    }

    if (request.Userfetchedcount > 0 || request.Emailconfirmed > 0) {
      return next(createAutherror([messages.ERROR.RESET_REQUEST_REJECTED], req.language))
    }

    const Datenow = new Date(request.Createtime);
    Datenow.setDate(Datenow.getDate() + 1);

    if (request.Createtime > Datenow) {
      return next(createAutherror([messages.ERROR.RESET_REQUEST_ENDED], req.language))
    }

    await db.passwordrefreshrequestModel.update({
      ...request,
      Emailconfirmed: true,
      Userfetchedcount: request.Userfetchedcount + 1,
      Updateduser: 'System',
      Updatetime: new Date()
    }, { where: { Uuid: request.Uuid } })

    res.redirect(config.services.Web + "Passwordreset/" + request.Uuid)
  } catch (error) {
    return next(sequelizeErrorCatcher(error))
  }
}

async function Resetpassword(req, res, next) {

  const {
    Password,
    RequestId
  } = req.body

  let validationErrors = []
  if (!validator.isString(Password)) {
    validationErrors.push(messages.VALIDATION_ERROR.PASSWORD_REQUIRED)
  }
  if (!validator.isUUID(RequestId)) {
    validationErrors.push(messages.VALIDATION_ERROR.REQUESTID_REQUIRED)
  }
  if (validationErrors.length > 0) {
    return next(createValidationError(validationErrors, req.language))
  }
  let user = null
  let usersalt = null
  try {
    const request = await db.passwordrefreshrequestModel.findOne({ where: { Uuid: RequestId } })
    if (!request) {
      return next(createNotfounderror([messages.ERROR.REQUEST_NOT_FOUND], req.language))
    }
    if (!request.Isactive) {
      return next(createNotfounderror([messages.ERROR.REQUEST_NOT_ACTIVE], req.language))
    }
    try {
      const userresponse = await axios({
        method: 'GET',
        url: config.services.Userrole + 'Users/' + request.UserID,
        headers: {
          session_key: config.session.secret
        }
      })
      const usersaltresponse = await axios({
        method: 'GET',
        url: config.services.Userrole + 'Users/Getusersalt/' + request.UserID,
        headers: {
          session_key: config.session.secret
        }
      })
      user = userresponse.data
      usersalt = usersaltresponse.data
    } catch (error) {
      return next(requestErrorCatcher(error, 'Userrole'))
    }
    const hash = await bcrypt.hash(Password, usersalt.Salt)

    try {
      await axios({
        method: 'PUT',
        url: config.services.Userrole + 'Users/UpdateUsermeta',
        headers: {
          session_key: config.session.secret
        },
        data: {
          ...user,
          PasswordHash: hash
        }
      })

    } catch (error) {
      return next(requestErrorCatcher(error, 'Userrole'))
    }
    await db.passwordrefreshrequestModel.update({
      ...request,
      Isactive: false,
      Deleteduser: 'System',
      Deletetime: new Date()
    }, { where: { Uuid: request.Uuid } })

  } catch (error) {
    return next(sequelizeErrorCatcher(error))
  }
  res.status(200).json({ message: "success" })
}


module.exports = {
  Createrequest,
  Validateresetrequest,
  Resetpassword,
  Getrequestbyuser
}