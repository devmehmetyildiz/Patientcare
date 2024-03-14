const messages = {
    ERROR: {
        PROFESSION_NOT_FOUND: {
            code: 'PROFESSION_NOT_FOUND', description: {
                en: 'profession not found',
                tr: 'Meslek Bulunamadı',
            }
        },
        PROFESSION_NOT_ACTIVE: {
            code: 'PROFESSION_NOT_ACTIVE', description: {
                en: 'profession is not active',
                tr: 'Meslek aktif değil',
            }
        },
    },
    VALIDATION_ERROR: {
        PROFESSIONID_REQUIRED: {
            code: 'PROFESSIONID_REQUIRED', description: {
                en: 'profession id required',
                tr: 'Meslek numarası gerekli',
            }
        },
        UNSUPPORTED_PROFESSIONID: {
            code: 'UNSUPPORTED_PROFESSIONID', description: {
                en: 'profession id unsupported',
                tr: 'Meslek numarası geçersiz',
            }
        },
        NAME_REQUIRED: {
            code: 'NAME_REQUIRED', description: {
                en: 'Name required',
                tr: 'İsim gerekli',
            }
        },
    }
}
module.exports = messages
