exports.isUUID = function (value) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}

exports.isObject = function (value) {
  return (typeof (value) === 'object' && !Array.isArray(value) && value !== null)
}

exports.isNumber = function (value) {
  return (/[-+]?\d*\.?\d*$/.test(value) && typeof (value) === 'number')
}

exports.isPositiveInteger = function (value) {
  return (Number.isInteger(value) && value >= 0)
}

exports.isString = function (value) {
  return (typeof (value) === 'string' && value !== '')
}

exports.isArray = function (value) {
  return (Array.isArray(value) && value.length > 0)
}

exports.isBoolean = function (value) {
  if (typeof (value) === 'boolean') {
    return true
  }
  if (typeof (value) === 'number' && (value === 0 || value === 1)) {
    return true
  }
  return false
}

exports.isQueryBoolean = function (value) {
  return (value === 'true' || value === 'false')
}

exports.isObjectId = function (value) {
  return /^[0-9a-fA-F]{24}$/.test(value)
}

exports.isISODate = function (value) {
  const date = new Date(value);
  return !isNaN(date);
}

exports.isEpochTime = function (value) {
  return (this.isNumber(value) && value.length === 13)
}

exports.isIpAddress = function (value) {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(value)
}

exports.isValidURL = function (str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}