const expect = require('expect')
const config = require('../Config')
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
  let code = privilege.replace('', '_').toUpperCase()

  let description = {
    en: `The ${descriptions[language]} access denied, you must have '${privilege}' privilege to do this operation`,
    tr: `${descriptions[language]} erişimi reddedildi, bu işlemi gerçekleştirebilmek için '${privilege}' yetkisine sahip olmalısın`,
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
  if (err && ((err.errno && err.errno === "ECONNREFUSED") || (err.code && err.code === "ECONNREFUSED"))) {
    if (serviceName && typeof (serviceName) === 'string') {
      return create('UNAVAILABLE', `${serviceName.toUpperCase()}_SERVICE_UNAVAILABLE`, `The ${serviceName.toLocaleLowerCase().replace(/_/g, '-')} service is unavailable`)
    } else {
      return create('UNAVAILABLE', 'UNKNOWN_SERVICE_UNAVAILABLE', 'The unknown service is unavailable')
    }
  }
  else if (err && err.error && ((err.error.errno && err.error.errno === "ECONNRESET") || (err.error.code && err.error.code === "ECONNRESET"))) {
    if (serviceName && typeof (serviceName) === 'string') {
      return create('REQUEST_TIMEOUT', `${serviceName.toUpperCase()}_SERVICE_REQUEST_TIMEOUT`, `The ${serviceName.toLocaleLowerCase().replace(/_/g, '-')} service responding timeout`)
    } else {
      return create('REQUEST_TIMEOUT', 'UNKNOWN_SERVICE_REQUEST_TIMEOUT', 'The unknown service responding timeout')
    }
  }
  else if (err && ((err.errno && err.errno === "ERR_BAD_RESPONSE") || (err.code && err.code === "ERR_BAD_RESPONSE"))) {
    if (serviceName && typeof (serviceName) === 'string') {
      return create('MICROSERVICE_INTERNALERROR', `${serviceName.toUpperCase()}_SERVICE_HAS_INTERNAL_ERROR`, (err.response && err.response.data) ? err.response.data.description ? err.response.data.description : err.response.data
        : `The ${serviceName.toLocaleLowerCase().replace(/_/g, '-')} has internal error`)
    } else {
      return create('MICROSERVICE_INTERNALERROR', 'UNKNOWN_SERVICE_HAS_INTERNAL_ERROR', 'The unknown service has internal error')
    }
  }
  else if (err && ((err.errno && err.errno === "ERR_BAD_REQUEST") || (err.code && err.code === "ERR_BAD_REQUEST"))) {
    if (serviceName && typeof (serviceName) === 'string') {
      return (err.response && err.response.data && err.response.data.type && err.response.data.code && err.response.data.description) ?
        err.response.data :
        create('MICROSERVICE_ERROR', `${serviceName.toUpperCase()}_SERVICE_HAS_ERROR`, (err.response && err.response.data) ? err.response.data.description ? err.response.data.description : err.response.data
          : `The ${serviceName.toLocaleLowerCase().replace(/_/g, '-')} gaved error`)
    } else {
      return create('MICROSERVICE_ERROR', 'UNKNOWN_SERVICE_GAVED_ERROR', 'The unknown service gaved error')
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
  if (err && err.message) {
    return create('SERVER_ERROR', `INTERNAL_${config.session.name.toUpperCase()}_ERROR`, err.message)
  }
  if (err && err.name) {
    return create('VALIDATION', err.name, (err.parent && err.parent.code && err.parent.sqlMessage) ? `${err.parent.code} ${err.parent.sqlMessage} on ${config.session.name} service` : `Undefines error on Sequileze on ${config.session.name} service`)
  }
  throw err;
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