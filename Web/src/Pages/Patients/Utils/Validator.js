const isUUID = function (value) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}
const isObject = function (value) {
  return (typeof (value) === 'object' && !Array.isArray(value) && value !== null && Object.keys(value).length > 0 && value?.Id !== 0)
}

const isNumber = function (value) {
  return (/[-+]?\d*\.?\d*$/.test(value) && typeof (value) === 'number')
}

const isPositiveInteger = function (value) {
  return (Number.isInteger(value) && value >= 0)
}

const isString = function (value) {
  return (typeof (value) === 'string' && value !== '')
}

const isArray = function (value) {
  return (Array.isArray(value) && value.length > 0)
}

const isBoolean = function (value) {
  if (typeof (value) === 'boolean') {
    return true
  }
  if (typeof (value) === 'number' && (value === 0 || value === 1)) {
    return true
  }
  return false
}

const isQueryBoolean = function (value) {
  return (value === 'true' || value === 'false')
}

const isObjectId = function (value) {
  return /^[0-9a-fA-F]{24}$/.test(value)
}

const isISODate = function (value) {
  const date = new Date(value);
  return !isNaN(date);
}

const isEpochTime = function (value) {
  return (this.isNumber(value) && value.length === 13)
}

const isIpAddress = function (value) {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(value)
}

const isValidURL = function (str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

const validator = {
  isValidURL,
  isIpAddress,
  isEpochTime,
  isISODate,
  isObjectId,
  isQueryBoolean,
  isBoolean,
  isArray,
  isString,
  isPositiveInteger,
  isNumber,
  isObject,
  isUUID
}

export default validator