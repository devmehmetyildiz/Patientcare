const messages = {
    ERROR: {
        PATIENTEVENTDEFINE_NOT_FOUND: {
            code: 'PATIENTEVENTDEFINE_NOT_FOUND', description: {
                en: 'paitent event define not found',
                tr: 'Hasta Vaka Tanımı Bulunamadı',
            }
        },
        PATIENTEVENTDEFINE_NOT_ACTIVE: {
            code: 'PATIENTEVENTDEFINE_NOT_ACTIVE', description: {
                en: 'patient event define is not active',
                tr: 'Hasta Vakası Aktif Değil',
            }
        },

    },
    VALIDATION_ERROR: {
        PATIENTEVENTDEFINEID_REQUIRED: {
            code: 'PATIENTEVENTDEFINEID_REQUIRED', description: {
                en: 'patient event define id required',
                tr: 'Hasta Vaka Tanımı Numarası Gerekli',
            }
        },
        UNSUPPORTED_PATIENTEVENTDEFINEID: {
            code: 'UNSUPPORTED_PATIENTEVENTDEFINEID', description: {
                en: 'patient event define id unsupported',
                tr: 'Hasta Vaka Tanımı Numarası Geçersiz',
            }
        },
        EVENTNAME_REQUIRED: {
            code: 'EVENTNAME_REQUIRED', description: {
                en: 'event name required',
                tr: 'Vaka Adı gerekli',
            }
        },
    }
}
module.exports = messages
