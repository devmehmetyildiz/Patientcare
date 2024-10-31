const isFile = function (value) {
  return value instanceof File;
}

const isNotNullorEmpty = function (value) {
  return !(value === null || value === undefined)
}

const isUUID = function (value) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}
const isObject = function (value) {
  return (typeof (value) === 'object' && !Array.isArray(value) && value !== null && Object.keys(value).length > 0 && value?.Id !== 0)
}

const isNumber = function (value) {
  return (/[-+]?\d*\.?\d*$/.test(value) && typeof value === 'number' && !isNaN(value));
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
  if (value) {
    const date = new Date(value);
    return !isNaN(date);
  } else {
    return false
  }
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

const isCountryID = (tcNumber) => {
  if (/^[1-9][0-9]{10}$/.test(tcNumber)) {
    const numberArray = tcNumber.split('').map(Number);
    const lastDigit = numberArray.pop();
    const sum = numberArray.reduce((acc, current) => acc + current, 0);
    const tenthDigit = sum % 10;

    if ((tenthDigit === lastDigit && numberArray[0] !== 0) || (sum % 10 === 0 && lastDigit === 0)) {
      return true;
    }
  }
  return false;
};

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
  isUUID,
  isCountryID,
  isFile,
  isNotNullorEmpty
}

export default validator