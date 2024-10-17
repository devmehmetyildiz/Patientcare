const config = require("../Config")
const validator = require('../Utilities/Validator')
module.exports.init = function (app) {
  app.use(function (req, res) {
    res.status(404)
    res.json({
      type: 'NOT_FOUND',
      code: 'ERR_NOT_FOUND',
      description: 'Resource not found in ' + config.session.name,
    })
  })

  app.use(function (err, req, res) {
    if (err !== undefined && err.type !== undefined) {

      const result = {
        type: err.type,
        code: err.code || '',
        description: err.description,
        fulldescription: err?.fulldescription?.stack
          ? isJsonString(err?.fulldescription?.stack) ? JSON.stringify(err?.fulldescription?.stack) : String(err?.fulldescription?.stack)
          : isJsonString(err?.stack) ? JSON.stringify(err?.stack) : String(err?.stack)
      }

      if (err.list !== undefined) {
        result.list = err.list
      }

      if (err.postRenderHelper !== undefined) {
        result.postRenderHelper = err.postRenderHelper
      }

      switch (err.type) {
        case 'PROMISE_BREAK':
          break

        case 'VALIDATION':
          res.status(400)
          res.json(result)
          break

        case 'FORBIDDEN':
          res.status(403)
          res.json(result)
          break

        case 'NOT_FOUND':
          res.status(404)
          res.json(result)
          break

        case 'UNAVAILABLE':
          res.status(503)
          res.json(result)
          break

        case 'UNAUTHORIZED':
          res.status(401)
          res.json(result)
          break

        case 'REQUEST_TIMEOUT':
          res.status(504)
          res.json(result)
          break

        case 'TIMEOUT':
          res.status(524)
          res.json(result)
          break
        case 'SERVER_ERROR':
          res.status(500)
          res.json(result)
          break
        case 'MICROSERVICE_INTERNALERROR':
          res.status(500)
          res.json(result)
          break

        default:
          if (isBodyParseError(err)) {
            res.status(err.statusCode)
            res.json({
              type: err.type,
              code: 'BODY_PARSE_ERROR',
              description: err.message,
              callstack: (config.env === 'development' ? err.stack : '')
            })
          } else {
            res.status(500)
            res.json({
              type: 'SERVER_ERROR',
              code: 'SERVER_ERROR',
              description: 'Unexpected internal server error happened.',
              callstack: (config.env === 'development' ? err.stack : '')
            })
          }
      }
    }
    else {
      res.status(500)
      res.json({
        type: 'SERVER_ERROR',
        code: 'SERVER_ERROR',
        description: err.message
      })
    }
  })
}


function isBodyParseError(err) {
  return err.type && err.expose && err.statusCode
}

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch {
    if (validator.isObject(str) || validator.isArray(str)) {
      return true
    }
    return false;
  }
  return true;
}