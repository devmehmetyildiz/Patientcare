const createErrorList = require('../Utilities/Error').createList
const messages = {
  ERROR: {
    ACCESS_TOKEN_NOT_FOUND: {
      code: 'ACCESS_TOKEN_NOT_FOUND', description: {
        en: 'AccessToken not found',
        tr: 'AccessToken bulunamadı',
      }
    },
    ACCESS_TOKEN_INVALID: {
      code: 'ACCESS_TOKEN_INVALID', description: {
        en: 'AccessToken is invalid',
        tr: 'AccessToken geçersiz',
      }
    },
    REFRESH_TOKEN_NOT_FOUND: {
      code: 'REFRESH_TOKEN_NOT_FOUND', description: {
        en: 'Refresh token not found',
        tr: 'Refresh token bulunamadı',
      }
    },
    REFRESH_TOKEN_EXPIRED: {
      code: 'REFRESH_TOKEN_EXPIRED', description: {
        en: 'Refresh token has been expired',
        tr: 'Refresh token süresi doldu',
      }
    },
    ADMIN_USER_ALREADY_ACTIVE: {
      code: 'ADMIN_USER_ALREADY_ACTIVE', description: {
        en: 'Admin user already active',
        tr: 'Admin kullanıcı zaten aktif',
      }
    },
    ROLE_NOT_FOUND: {
      code: 'ROLE_NOT_FOUND', description: {
        en: 'Role not found',
        tr: 'Rol bulunamadı',
      }
    },
    USER_NOT_FOUND: {
      code: 'USER_NOT_FOUND', description: {
        en: 'User not found',
        tr: 'Kullanıcı bulunamadı',
      }
    },
    TABLEMETA_NOT_FOUND: {
      code: 'TABLEMETA_NOT_FOUND', description: {
        en: 'Table meta not found',
        tr: 'Tablo meta datası bulunamadı',
      }
    },
    ROLE_NOT_ACTIVE: {
      code: 'ROLE_NOT_ACTIVE', description: {
        en: 'Role not active',
        tr: 'Rol aktif değil',
      }
    },
    USER_NOT_ACTIVE: {
      code: 'USER_NOT_ACTIVE', description: {
        en: 'User not active',
        tr: 'Kullanıcı aktif değil',
      }
    },
    USERROLE_NOT_FOUND: {
      code: 'USERROLE_NOT_FOUND', description: {
        en: 'User role not found',
        tr: 'Kullanıcı rolü bulunamadı',
      }
    },
    USERSALT_NOT_FOUND: {
      code: 'USERSALT_NOT_FOUND', description: {
        en: 'User salt not found',
        tr: 'Kullanıcı tuzu bulunamadı',
      }
    },
  },
  VALIDATION_ERROR: {
    NAME_REQUIRED: {
      code: 'NAME_REQUIRED', description: {
        en: 'The name required',
        tr: 'Bu işlem için isim gerekli',
      }
    },
    META_REQUIRED: {
      code: 'META_REQUIRED', description: {
        en: 'The meta required',
        tr: 'Bu işlem için meta data gerekli',
      }
    },
    CONFIG_REQUIRED: {
      code: 'CONFIG_REQUIRED', description: {
        en: 'The config required',
        tr: 'Bu işlem için config gerekli',
      }
    },
    ROLEID_REQUIRED: {
      code: 'ROLEID_REQUIRED', description: {
        en: 'The role uuid required',
        tr: 'Bu işlem için rol uuid gerekli',
      }
    },
    UNSUPPORTED_ROLEID: {
      code: 'UNSUPPORTED_ROLEID', description: {
        en: 'Unstupported uuid has given',
        tr: 'Geçersiz role id',
      }
    },
    PRIVILEGES_REQUIRED: {
      code: 'PRIVILEGES_REQUIRED', description: {
        en: 'At least 1 privileges required',
        tr: 'En az 1 adet yetki seçilmelidir.',
      }
    },
    USERNAME_REQUIRED: {
      code: 'USERNAME_REQUIRED', description: {
        en: 'The username required',
        tr: 'Bu işlem için kullanıcı adı gerekli',
      }
    },
    PASSWORD_REQUIRED: {
      code: 'PASSWORD_REQUIRED', description: {
        en: 'The user password required',
        tr: 'Bu işlem için kullanıcı şifresi gerekli',
      }
    },
    EMAIL_REQUIRED: {
      code: 'EMAIL_REQUIRED', description: {
        en: 'The email required',
        tr: 'Bu işlem için e-posta gerekli',
      }
    },
    SURNAME_REQUIRED: {
      code: 'SURNAME_REQUIRED', description: {
        en: 'The surname required',
        tr: 'Bu işlem için soyisim gerekli',
      }
    },
    LANGUAGE_REQUIRED: {
      code: 'LANGUAGE_REQUIRED', description: {
        en: 'The language required',
        tr: 'Bu işlem için dil gerekli',
      }
    },
    TOWN_REQUIRED: {
      code: 'TOWN_REQUIRED', description: {
        en: 'The town required',
        tr: 'Bu işlem için ilçe gerekli',
      }
    },
    CITY_REQUIRED: {
      code: 'CITY_REQUIRED', description: {
        en: 'The city required',
        tr: 'Bu işlem için şehir gerekli',
      }
    },
    ADDRESS_REQUIRED: {
      code: 'ADDRESS_REQUIRED', description: {
        en: 'The address required',
        tr: 'Bu işlem için adres gerekli',
      }
    },
    USERID_REQUIRED: {
      code: 'USERID_REQUIRED', description: {
        en: 'The user uuid required',
        tr: 'Bu işlem için kullanıcı uuid gerekli',
      }
    },
    DEPARTMENTS_REQUIRED: {
      code: 'DEPARTMENTS_REQUIRED', description: {
        en: 'The departments required',
        tr: 'Bu işlem için departmanlar gerekli',
      }
    },
    ROLES_REQUIRED: {
      code: 'ROLES_REQUIRED', description: {
        en: 'The roles required',
        tr: 'Bu işlem için roller gerekli',
      }
    },
    STATIONS_REQUIRED: {
      code: 'STATIONS_REQUIRED', description: {
        en: 'The stations required',
        tr: 'Bu işlem için istasyonlar gerekli',
      }
    },
    UNSUPPORTED_USERID: {
      code: 'UNSUPPORTED_USERID', description: {
        en: 'Unstupported uuid has given',
        tr: 'Geçersiz kullanıcı id girişi',
      }
    },
    UNSUPPORTED_STATIONID: {
      code: 'UNSUPPORTED_STATIONID', description: {
        en: 'Unstupported station uuid has given',
        tr: 'Geçersiz istasyon id girişi',
      }
    },
    USERNAME_DUPLICATE: {
      code: 'USERNAME_DUPLICATE', description: {
        en: 'Username already active',
        tr: 'Kullanıcı adı zaten mevcut',
      }
    },
    EMAIL_DUPLICATE: {
      code: 'EMAIL_DUPLICATE', description: {
        en: 'E-mail already active',
        tr: 'E-posta zaten mevcut',
      }
    },
  }

}
module.exports = messages
