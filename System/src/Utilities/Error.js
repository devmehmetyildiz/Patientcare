const expect = require('expect')
function create(type, code) {
  let errorList = null
  let message = null
  let lastArgument = arguments[arguments.length - 1]

  if (arguments.length === 3) {
    if (Array.isArray(lastArgument)) {
      errorList = lastArgument
    } else if (typeof lastArgument === 'string') {
      message = lastArgument
    }
  } else if (arguments.length === 4) {
    errorList = lastArgument
    message = arguments[arguments.length - 2]
  }

  message = message || code
  let err = new Error(message)
  err.description = message
  err.type = type
  err.code = code
  if (errorList) {
    err.list = errorList
  }

  if (arguments.length === 5 && arguments[4]) {
    err.postRenderHelper = arguments[4]
    err.description = arguments[2]
  }

  return err
}

function createList(type, code) {
  let errorList = {}
  let lastArgument = arguments[arguments.length - 1]

  if (arguments.length === 3 && typeof lastArgument === 'object') {
    for (const [languageKey, languageDescription] of Object.entries(lastArgument)) {
      errorList[languageKey] = create(type, code, languageDescription)
    }
  }

  return errorList
}

function createValidation(param, language) {
  let errorList = param
  if (!Array.isArray(param)) {
    errorList = [param]
  }

  let description = {
    en: 'Validation failed. Look in list property for details',
    tr: 'Veri doğrulaması başarısız. Ayrıntılar için aşağıdaki listeyi inceleyin',
    ru: 'Проверка данных не удалась. Подробности см. В приведенном ниже списке.',
  }
  return create('VALIDATION', 'VALIDATION_FAILED', description[language || 'en'],
    errorList.filter(u => u !== undefined).map(item => {
      let description = item.description[language || 'en'] || item.code
      return create('VALIDATION_ITEM', item.code, description)
    })
  )
}

function createAutherror(param, language) {
  let errorList = param
  if (!Array.isArray(param)) {
    errorList = [param]
  }

  let description = {
    en: 'Auth system error. Look in list property for details',
    tr: 'Güvenlik sistemi hatası. Ayrıntılar için aşağıdaki listeyi inceleyin',
  }
  return create('UNAUTHORIZED', 'ACCESS_DENIED', description[language || 'en'],
    errorList.filter(u => u !== undefined).map(item => {
      let description = (item.description ? (item.description[language || 'en']) : null) || item.code
      return create('ACCESS_DENIED', item.code, description)
    })
  )
}

function createNotfounderror(param, language) {
  let errorList = param
  if (!Array.isArray(param)) {
    errorList = [param]
  }

  let description = {
    en: 'Not Found. Look in list property for details',
    tr: 'Veri doğrulaması başarısız. Ayrıntılar için aşağıdaki listeyi inceleyin',
  }
  return create('NOT_FOUND', 'REQUEST_FAILED', description[language || 'en'],
    errorList.filter(u => u !== undefined).map(item => {
      let description = (item.description ? (item.description[language || 'en']) : null) || item.code
      return create('NOT_FOUND_ITEM', item.code, description)
    })
  )
}

function createAccessDenied(privilege, language, descriptions) {
  let code = privilege.replace(/\.?([A-Z])/g, function (x, y) { return "_" + y }).replace(/^_/, "").toUpperCase()

  let description = {
    en: `The ${descriptions[language]} access denied, you must have '${privilege}' privilege to do this operation`,
    tr: `${descriptions[language]} erişimi reddedildi, bu işlemi gerçekleştirebilmek için '${privilege}' yetkisine sahip olmalısın`,
    ru: `Отказано в доступе к ${descriptions[language]}, для выполнения этого действия у вас должна быть привилегия '${privilege}'`
  }
  return create('FORBIDDEN', `${code}_ACCESS_DENIED`, description[language])
}

function createResourceAccessDenied(modelName, resource, language) {
  let description = {
    en: `The ${resource} access denied for you`,
    tr: `${resource} kaynağı için erişim reddedildi`,
    ru: `Вам отказано в доступе к ${resource}`,
  }

  return create('FORBIDDEN', `${modelName.toUpperCase()}_ACCESS_DENIED`, description[language || 'en'])
}

function handleMiddlewareError(err, next) {
  if (!err.type) {
    next(err)
  } else {
    next(create(err.type, err.code, err.description, err.list))
  }
}

function isValidationError(error) {
  return new Promise((resolve, reject) => {
    const validationError = {
      type: 'VALIDATION',
      code: 'VALIDATION_FAILED',
      description: 'Validation failed. Look in list property for details'
    }
    expect(error.type).toEqual(validationError.type)
    expect(error.type).toEqual(validationError.code)
    expect(error.description).toEqual(validationError.description)
    expect(error.list).arrayContaining(validationError.list)
    resolve()
  })
}

function requestErrorCatcher(err, serviceName = null) {
  if (err && err.error && ((err.error.errno && err.error.errno === "ECONNREFUSED") || (err.error.code && err.error.code === "ECONNREFUSED"))) {
    if (serviceName && typeof (serviceName) === 'string') {
      throw create('UNAVAILABLE', `${serviceName.toUpperCase()}_SERVICE_UNAVAILABLE`, `The ${serviceName.toLocaleLowerCase().replace(/_/g, '-')} service is unavailable`)
    } else {
      throw create('UNAVAILABLE', 'UNKNOWN_SERVICE_UNAVAILABLE', 'The unknown service is unavailable')
    }
  }
  else if (err && err.error && ((err.error.errno && err.error.errno === "ECONNRESET") || (err.error.code && err.error.code === "ECONNRESET"))) {
    if (serviceName && typeof (serviceName) === 'string') {
      throw create('REQUEST_TIMEOUT', `${serviceName.toUpperCase()}_SERVICE_REQUEST_TIMEOUT`, `The ${serviceName.toLocaleLowerCase().replace(/_/g, '-')} service responding timeout`)
    } else {
      throw create('REQUEST_TIMEOUT', 'UNKNOWN_SERVICE_REQUEST_TIMEOUT', 'The unknown service responding timeout')
    }
  }
  else if (err.error && typeof (err.error) === "string") {
    let parsedError = null
    try {
      parsedError = JSON.parse(err.error)
    } catch (parseError) {
      throw err.error
    }
    throw parsedError
  } else if (err.error && typeof (err.error) === "object") {
    if (err.error.code !== undefined && err.error.type !== undefined) {
      throw err.error
    } else {
      throw err
    }
  } else {
    throw err
  }
}

function sequelizeErrorCatcher(err, errHelper) {
  if (err && err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeUniqueConstraintError') {
    switch (err.parent.code) {
      case 'ER_NO_SUCH_TABLE':
        throw create('VALIDATION', 'ER_NO_SUCH_TABLE', err.parent.sqlMessage)
      case 'ER_DUP_ENTRY':
        throw create('VALIDATION', 'ER_DUP_ENTRY', err.parent.sqlMessage)
      case 'ER_BAD_FIELD_ERROR':
        throw create('VALIDATION', 'ER_BAD_FIELD_ERROR', err.parent.sqlMessage)
      default:
        throw err;
    }
  } else {
    throw err;
  }
}

module.exports.create = create
module.exports.createList = createList
module.exports.isValidationError = isValidationError
module.exports.createValidation = createValidation
module.exports.createAccessDenied = createAccessDenied
module.exports.handleMiddlewareError = handleMiddlewareError
module.exports.requestErrorCatcher = requestErrorCatcher
module.exports.sequelizeErrorCatcher = sequelizeErrorCatcher
module.exports.createResourceAccessDenied = createResourceAccessDenied
module.exports.createNotfounderror = createNotfounderror
module.exports.createAutherror = createAutherror