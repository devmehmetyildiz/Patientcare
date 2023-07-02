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
    REQUEST_NOT_ACTIVE: {
      code: 'REQUEST_NOT_ACTIVE', description: {
        en: 'Password reset request not active',
        tr: 'Parola sıfırlama talebi aktif değil',
      }
    },
    REQUEST_NOT_FOUND: {
      code: 'REQUEST_NOT_FOUND', description: {
        en: 'Password reset request not found',
        tr: 'Parola Sıfırlama talebi bulunamadı',
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
    GRANTTYPE_REQUIRED: {
      code: 'GRANTTYPE_REQUIRED', description: {
        en: 'The Grant type required',
        tr: 'Bu işlem için grant type gerekli',
      }
    },
    REQUESTID_REQUIRED: {
      code: 'REQUESTID_REQUIRED', description: {
        en: 'The request id required',
        tr: 'Bu işlem için talep idsi gerekli',
      }
    },
    INVALID_GRANTTYPE: {
      code: 'INVALID_GRANTTYPE', description: {
        en: 'The Grant type is invalid',
        tr: 'Geçersiz grant type',
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
    USERID_REQUIRED: {
      code: 'USERID_REQUIRED', description: {
        en: 'The user uuid required',
        tr: 'Bu işlem için kullanıcı uuid gerekli',
      }
    },
    UNSUPPORTED_USERID: {
      code: 'UNSUPPORTED_USERID', description: {
        en: 'Unstupported uuid has given',
        tr: 'Geçersiz kullanıcı id girişi',
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
