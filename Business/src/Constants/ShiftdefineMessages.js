const messages = {
    ERROR: {
        SHIFTDEFINE_NOT_FOUND: {
            code: 'SHIFTDEFINE_NOT_FOUND', description: {
                en: 'Shift define not found',
                tr: 'Vardiya tanımı Bulunamadı',
            }
        },
        SHIFTDEFINE_NOT_ACTIVE: {
            code: 'SHIFTDEFINE_NOT_ACTIVE', description: {
                en: 'Shift define is not active',
                tr: 'Vardiya Tanımı aktif değil',
            }
        },
    },
    VALIDATION_ERROR: {
        SHIFTDEFINEID_REQUIRED: {
            code: 'SHIFTDEFINEID_REQUIRED', description: {
                en: 'Shift define id required',
                tr: 'Vardiya Tanımı id gerekli',
            }
        },
        UNSUPPORTED_SHIFTDEFINEID: {
            code: 'UNSUPPORTED_SHIFTDEFINEID', description: {
                en: 'Shift define id unsupported',
                tr: 'Vardiya tanımı id geçersiz',
            }
        },
        NAME_REQUIRED: {
            code: 'NAME_REQUIRED', description: {
                en: 'Name required',
                tr: 'İsim gerekli',
            }
        },
        STARTTIME_REQUIRED: {
            code: 'STARTTIME_REQUIRED', description: {
                en: 'Start time required',
                tr: 'Başlangıç zamanı gerekli',
            }
        },
        ENDTIME_REQUIRED: {
            code: 'ENDTIME_REQUIRED', description: {
                en: 'End time required',
                tr: 'Bitiş zamanı gerekli',
            }
        },
    }
}
module.exports = messages
