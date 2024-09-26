const messages = {
    ERROR: {
        ADMIN_USER_ALREADY_ACTIVE: {
            code: 'ADMIN_USER_ALREADY_ACTIVE', description: {
                en: 'Admin user already active',
                tr: 'Admin kullanıcı zaten aktif',
            }
        },
        USER_NOT_FOUND: {
            code: 'USER_NOT_FOUND', description: {
                en: 'User not found',
                tr: 'Kullanıcı bulunamadı',
            }
        },
        USER_NOT_ACTIVE: {
            code: 'USER_NOT_ACTIVE', description: {
                en: 'User not active',
                tr: 'Kullanıcı aktif değil',
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
        UNSUPPORTED_ROLEID: {
            code: 'UNSUPPORTED_ROLEID', description: {
                en: 'Unstupported uuid has given',
                tr: 'Geçersiz role id',
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
        ROLES_REQUIRED: {
            code: 'ROLES_REQUIRED', description: {
                en: 'The roles required',
                tr: 'Bu işlem için roller gerekli',
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
        CASEID_REQUIRED: {
            code: 'CASEID_REQUIRED', description: {
                en: 'The case uuid required',
                tr: 'Bu işlem için durum uuid gerekli',
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
        MOVEMENT_END_DATE_REQUIRED: {
            code: 'MOVEMENT_END_DATE_REQUIRED', description: {
                en: 'The movement end date required, system should know end date when you enter past dated movement',
                tr: 'Bu işlem için hareket sona erme tarihi gerekli, geçmiş tarihli hareket girişlerinde sistem bitiş tarihi bilmeli',
            }
        },
        MOVEMENT_END_DATE_TOO_BIG: {
            code: 'MOVEMENT_END_DATE_TOO_BIG', description: {
                en: 'The movement end date is too big, you should enter lower date before next movement start',
                tr: 'Hareket sona erme tarihi çok güncel, geçmiş tarihli hareketlerde bir sonraki hareket tarihinden daha geçmiş hareket tarihi girmen gerekli',
            }
        },
    }

}
module.exports = messages
