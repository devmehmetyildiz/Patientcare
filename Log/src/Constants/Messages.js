const messages = {
  ERROR: {


  },
  VALIDATION_ERROR: {
    SERVERNAME_REQUIRED: {
      code: 'SERVERNAME_REQUIRED', description: {
        en: 'The server name required',
        tr: 'Bu işlem için server adı gerekli',
      }
    },
    REQUESTUSERID_REQUIRED: {
      code: 'REQUESTUSERID_REQUIRED', description: {
        en: 'The request user ID required',
        tr: 'Bu işlem için talep eden kullanıcı ID gerekli',
      }
    },
    REQUESTTYPE_REQUIRED: {
      code: 'REQUESTTYPE_REQUIRED', description: {
        en: 'The request type required',
        tr: 'Bu işlem için talep türü gerekli',
      }
    },
    REQUESTURL_REQUIRED: {
      code: 'REQUESTURL_REQUIRED', description: {
        en: 'The request url required',
        tr: 'Bu işlem için talep url bilgisi gerekli',
      }
    },
    STATUS_REQUIRED: {
      code: 'STATUS_REQUIRED', description: {
        en: 'The status required',
        tr: 'Bu işlem için durum gerekli',
      }
    },
  }
}
module.exports = messages
